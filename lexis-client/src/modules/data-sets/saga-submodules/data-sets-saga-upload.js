import apiActions from "../../api/api-actions"
import { customValidationWrapper } from "../ui/create-dataset-wizard/validate"
import { displayShortBiSize, predictSizeOfbase64, getFileID } from "../../utils"
import { destroy, isValid } from "redux-form"
import { TUSErrorException } from "../../api/exceptions/tus-error-exception"
import Actions from "../data-sets-actions"
import config from "../../../config"
import { call, put, fork, select, take, cancel } from "redux-saga/effects"
import { createApiSafely, readApiSafely } from "../../api/api-saga"
import {
    listProjects,
    postCreateDataset,
    uploadDatasetTUS
} from "../../api/client"
import { channel } from "redux-saga"
import {
    onTermTUSHandler,
    tusErrorHandler,
    tusShouldRetryErrorHandler
} from "../../api/api-saga"
import {
    getDSCreateWizardFormValues,
    getDSToUploadFormValues,
    getWizardActivePage
} from "../data-sets-selectors"
import projectsActions from "../../projects/projects-actions"
import { projects as projectsSchema } from "../../api/schema"
import { normalizeAndStore } from "../../entity-repository/entity-repository-saga"
import { getUserName } from "../../auth/auth-selectors"

export const ds_req_progress_status_chan = channel()

export function* reqStatusListener() {
    while (true) {
        /**
         * @type {{status:string, progress: Number, upDownSpeed: Number, remainingTime: Number, errorString: string}}
         */
        const {
            status,
            progress,
            upDownSpeed,
            remainingTime,
            errorString
        } = yield take(ds_req_progress_status_chan)
        yield put(
            Actions.Creators.reqProgressStatus(
                status,
                progress,
                upDownSpeed,
                remainingTime,
                errorString
            )
        )
    }
}

/**
 * asynchronous function returning b64 of file content
 * @param {File} file
 * @returns {String} file content encoded in b64 ascii
 */
function getB64fromFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = () => {
            // btoa() -> binary to ascii base64, inverted function atob()
            resolve(btoa(reader.result))
        }
        reader.onerror = () => {
            throw new Error("FileReader: Encoding to Base 64 failed")
        }
    })
}

export function reqProgressListener() {
    const beginTime = Date.now()

    return ({ loaded, total }) => {
        const progress = loaded / (total / 100)
        const tmstmp = Date.now()
        const upDownSpeed = loaded / ((tmstmp - beginTime) / 1000) // upload/download speed in bytes per second
        const remainingTime = Math.trunc((total - loaded) / upDownSpeed) // remaining time in seconds
        if (progress === 100) {
            ds_req_progress_status_chan.put({
                status: "sending",
                progress: 100,
                upDownSpeed: null,
                remainingTime: 0,
                errorString: null
            })
        } else {
            ds_req_progress_status_chan.put({
                status: "sending",
                progress: progress.toFixed(2),
                upDownSpeed,
                remainingTime,
                errorString: null
            })
        }
    }
}

function reqTUSonProgressListener() {
    const beginTime = Date.now()

    return (loaded, total) => {
        const progress = loaded / (total / 100)
        const tmstmp = Date.now()
        const upDownSpeed = loaded / ((tmstmp - beginTime) / 1000) // upload/download speed in bytes per second
        const remainingTime = Math.trunc((total - loaded) / upDownSpeed) // remaining time in seconds
        if (progress === 100) {
            ds_req_progress_status_chan.put({
                status: "done",
                progress: 100,
                upDownSpeed: null,
                remainingTime: 0,
                errorString: null
            })
        } else {
            ds_req_progress_status_chan.put({
                status: "sending",
                progress: progress.toFixed(2),
                upDownSpeed,
                remainingTime,
                errorString: null
            })
        }
    }
}
/**
 * Create or update dataset via TUS, for creating, pass undefined path and internalID
 * @param {{}} data
 * @param {string} path
 * @param {string} internalID
 * @returns {string} resInternalID
 */
function* onDatasetCreateUpdateDirectUpload(data, path, internalID) {
    try {
        yield put(
            Actions.Creators.reqProgressStatus(
                "proccessing",
                0,
                null,
                null,
                "Please wait, encoding the file..."
            )
        )
        const isNotUpdate = !(path && internalID)
        const b64fileString = yield getB64fromFile(data.savedFile.file[0])
        const realByteSizeOfFile = new Blob([b64fileString]).size
        const encryption = data.savedFile.enc ? "yes" : "no"
        const compression = data.savedFile.comp ? "yes" : "no"

        if (realByteSizeOfFile < config.DSzonesBodySizeLimit[data.zone]) {
            const { internalID: resInternalID } = yield call(
                createApiSafely,
                postCreateDataset,
                "directupload",
                path,
                data.savedFile.file[0].name,
                b64fileString,
                data.savedFile.fileType,
                internalID,
                data.access,
                data.project,
                isNotUpdate ? data.metadata : undefined,
                isNotUpdate ? encryption : undefined,
                isNotUpdate ? compression : undefined,
                data.zone,
                reqProgressListener()
            )
            yield put(
                Actions.Creators.reqProgressStatus(
                    "done",
                    0,
                    null,
                    null,
                    resInternalID
                )
            )
            return resInternalID
        } else {
            const limitErrMsg = `File exceeded size limit ${displayShortBiSize(
                config.DSzonesBodySizeLimit[data.zone]
            )} of direct upload method after encoded to Base64 with size ${displayShortBiSize(
                realByteSizeOfFile
            )}`
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    limitErrMsg
                )
            )
        }
    } catch (e) {
        if (e instanceof Error) {
            const { message } = e
            switch (message) {
            case "FileReader: Encoding to Base 64 failed":
                yield put(
                    Actions.Creators.reqProgressStatus(
                        "error",
                        0,
                        null,
                        null,
                        "Failed to encode the file to Base64 encoding"
                    )
                )
                yield put(apiActions.Creators.warningException(message))
                break
            default:
                yield put(
                    Actions.Creators.reqProgressStatus(
                        "error",
                        0,
                        null,
                        null,
                        "Sorry, some unexpected error occured... " + message
                    )
                )
                break
            }
        }
    }
}

class TUSErrorHandlerSetup {
    constructor() {
        this.errChannel = channel()
        this.softErrors = 0
        this.hardError = false
        this.retryTime = 0
        this.listenerTask = null
    }
}

/**
 *
 * @param {TUSErrorHandlerSetup} tusHandlerClass
 * @param {Channel} reqProgChannel
 */
function* tusErrorHandlerListener(tusHandlerClass, reqProgChannel) {
    while (true) {
        /**
         * @type {{name: string, message: string, status: Number, type: 'soft'|'hard', retryIn: Number}} data for error construction
         */
        const { name, message, status, type, retryIn } = yield take(
            tusHandlerClass.errChannel
        )
        if (type === "soft") {
            tusHandlerClass.softErrors += 1
            yield put(
                apiActions.Creators.warningException(
                    `TUS upload error, trying again in ${
                        retryIn / 1000
                    }s: ${name} - ${status}`
                )
            )
        } else {
            tusHandlerClass.hardError = true
            reqProgChannel.put({
                status: "error",
                errorString: `Upload request ended with status ${status}: \n${message}`
            })
            break
        }
    }
}

/**
 *
 * @param {TUSErrorHandlerSetup} tusHandlerClass
 */
function* destroyListener(tusHandlerClass) {
    while (true) {
        // wait for events, which closes listener and channel
        const { status } = yield take(Actions.Types.REQ_PROGRESS_STATUS)
        if (status === "error" || status === "done" || status === "cancelled") {
            yield cancel(tusHandlerClass.listenerTask)
            tusHandlerClass.errChannel.close()
            break
        }
    }
}
/**
 * handle pause and cancel button
 * @param {Upload} TusInstance
 */
function* TusHandlePauseContCancel(TusInstance) {
    let prevUploads
    handleLoop: while (true) {
        const { status } = yield take(Actions.Types.REQ_PROGRESS_STATUS)
        switch (status) {
        case "pause":
            // this happen when pause action was dispatched
            TusInstance.abort(false)
                .then(() =>
                    ds_req_progress_status_chan.put({
                        status: "paused",
                        progress: null,
                        upDownSpeed: null,
                        remainingTime: 0,
                        errorString: null
                    })
                )
                .catch(onTermTUSHandler)
            break
        case "continue":
            prevUploads = yield TusInstance.findPreviousUploads()
            if (prevUploads.length)
                TusInstance.resumeFromPreviousUpload(prevUploads[0])
            yield put(
                Actions.Creators.reqProgressStatus(
                    "proccessing",
                    0,
                    null,
                    null,
                    "Please wait, resuming upload"
                )
            )
            TusInstance.start()
            break
        case "cancel":
            // this happen when cancel action was dispatched
            yield TusInstance.abort(true)
                .then(() =>
                    ds_req_progress_status_chan.put({
                        status: "cancelled",
                        progress: null,
                        upDownSpeed: null,
                        remainingTime: 0,
                        errorString: null
                    })
                )
                .catch(onTermTUSHandler)
            break

        case "cancelled":
        case "error":
        case "done":
            break handleLoop
        default:
            break
        }
    }
}
/**
 *
 * @param {string} tusURL
 * @param {string} path
 * @param {string} fileName
 * @param {'zip'|'file'} fileType
 * @param {string} internalID
 * @param {{access: 'public'|'project'|'user', project: string, metadata: {},
 * encryption: string, compression:string, zone:string}} data
 * @param {boolean} withReqStatus will dispatch action reqProgressStatus of proccessing and done or error
 * @returns {string} resInternalID if success
 */
function* onDatasetCreateUpdateTUSRecord(
    tusURL,
    path,
    fileName,
    fileType,
    internalID,
    data,
    withReqStatus
) {
    try {
        if (withReqStatus) {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "proccessing",
                    0,
                    null,
                    null,
                    "Please wait, creating record of dataset..."
                )
            )
        }

        // tusURL contains the final path with filename for linking upload with creation of dataset in BE
        const { internalID: resInternalID } = yield call(
            readApiSafely,
            postCreateDataset,
            "tus",
            path,
            fileName,
            tusURL,
            fileType,
            internalID,
            data.access,
            data.project,
            data.metadata,
            data.encryption,
            data.compression,
            data.zone
        )
        if (withReqStatus) {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "done",
                    0,
                    null,
                    null,
                    resInternalID
                )
            )
        } else yield put(apiActions.Creators.success("Dataset record accepted"))
        return resInternalID
    } catch (e) {
        const { message } = e
        if (withReqStatus)
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Sorry, some unexpected error occured... " + message
                )
            )
        else throw e
    }
}
/**
 *  Wait for done status of reqProgressStatus or error status, on error, stop listening on done, call onDatasetCreateUpdateTUS
 * @param {TUSErrorHandlerSetup} requestHandler
 * @param  {...onDatasetCreateUpdateTUS} args
 */
function* onDatasetCrRecTUSwaitForDone(TusInstance, requestHandler, ...args) {
    let softErrors = 0
    while (true) {
        const { status } = yield take(Actions.Types.REQ_PROGRESS_STATUS)
        if (status === "done" && requestHandler.softErrors === softErrors) {
            yield call(onDatasetCreateUpdateTUSRecord, TusInstance.url, ...args)
            break
        } else if (status === "error" || requestHandler.hardError === true)
            break
        if (softErrors !== requestHandler.softErrors) {
            softErrors = requestHandler.softErrors
        }
    }
}

/**
 * Create or update dataset via TUS, for creating, pass undefined path and internalID
 * @param {*} datasetInfoAndMeta
 * @param {string} path
 * @param {string} internalID
 */
function* onDatasetCreateUpdateTUSUpload(datasetInfoAndMeta, path, internalID) {
    try {
        yield put(
            Actions.Creators.reqProgressStatus(
                "proccessing",
                0,
                null,
                null,
                "Please wait, preparing TUS instance..."
            )
        )

        /**
         * init error handler
         * @type {TUSErrorHandlerSetup}
         */
        const TusErrorClass = new TUSErrorHandlerSetup()
        TusErrorClass.listenerTask = yield fork(
            tusErrorHandlerListener,
            TusErrorClass,
            ds_req_progress_status_chan
        )
        yield fork(destroyListener, TusErrorClass)

        yield put(
            Actions.Creators.reqProgressStatus(
                "proccessing",
                0,
                null,
                null,
                "Please wait, connecting via TUS..."
            )
        )

        const userName = yield select(getUserName)

        // start tus upload
        const TusInstance = uploadDatasetTUS(
            datasetInfoAndMeta.savedFile.file[0],
            internalID,
            datasetInfoAndMeta.project,
            datasetInfoAndMeta.zone,
            datasetInfoAndMeta.access,
            userName,
            reqTUSonProgressListener(),
            tusErrorHandler(TusErrorClass.errChannel),
            tusShouldRetryErrorHandler(TusErrorClass.errChannel)
        )

        yield fork(TusHandlePauseContCancel, TusInstance)
        yield fork(
            onDatasetCrRecTUSwaitForDone,
            TusInstance,
            TusErrorClass,
            path,
            datasetInfoAndMeta.savedFile.file[0].name,
            datasetInfoAndMeta.savedFile.type,
            internalID,
            datasetInfoAndMeta,
            true
        )
    } catch (e) {
        if (e instanceof TUSErrorException) {
            // catch TUS specific errors
            const { message } = e
            switch (message) {
            case "Termination Error":
                yield put(
                    apiActions.Creators.warningException(
                        `TUS upload termination error: ${e.name} - ${e.message}`
                    )
                )
                break
            default:
                yield put(
                    Actions.Creators.reqProgressStatus(
                        "error",
                        0,
                        null,
                        null,
                        `TUS error: ${e.name} - ${e.message}`
                    )
                )
                yield put(
                    apiActions.Creators.onServerError(
                        `${e.name} - ${e.message}`
                    )
                )
                break
            }
        } else if (e instanceof Error) {
            const { message } = e
            switch (message) {
            case "Got undefined internalID, please try again":
                yield put(
                    Actions.Creators.reqProgressStatus(
                        "error",
                        0,
                        null,
                        null,
                        "Unable to continue, please try again: " + message
                    )
                )
                yield put(apiActions.Creators.warningException(message))
                break

            default:
                yield put(
                    Actions.Creators.reqProgressStatus(
                        "error",
                        0,
                        null,
                        null,
                        "Sorry, some unexpected error occured... " + message
                    )
                )
                yield put(apiActions.Creators.warningException(message))
                break
            }
        }
    }
}

export function* onDatasetCreateUploadSubmit() {
    const formValsUploadFrag = yield select(getDSToUploadFormValues)
    const formValsCreateWiz = yield select(getDSCreateWizardFormValues)
    if (customValidationWrapper(formValsUploadFrag, formValsCreateWiz)) {
        if (formValsUploadFrag.savedFile.uploadType === "directupload") {
            yield call(
                onDatasetCreateUpdateDirectUpload,
                {
                    ...formValsUploadFrag,
                    ...formValsCreateWiz
                },
                undefined,
                undefined
            )
        } else if (formValsUploadFrag.savedFile.uploadType === "tus") {
            yield call(
                onDatasetCreateUpdateTUSUpload,
                {
                    ...formValsUploadFrag,
                    ...formValsCreateWiz
                },
                undefined,
                undefined
            )
        }
    } else {
        yield put(
            apiActions.Creators.warning({
                message:
                    "Submission failed: Please check, if all required fields are filled properly"
            })
        )
    }
}

export function* onUploadIntoExisting({
    internalID,
    path,
    projectShortName,
    access,
    zone
}) {
    const isValidUpload = yield select(isValid("datasetToUpload"))
    if (isValidUpload) {
        const formValsUploadFrag = yield select(getDSToUploadFormValues)
        const metadataAndFile = {
            ...formValsUploadFrag,
            project: projectShortName,
            access,
            zone
        }
        if (formValsUploadFrag.savedFile.uploadType === "directupload") {
            yield call(
                onDatasetCreateUpdateDirectUpload,
                metadataAndFile,
                path,
                internalID
            )
        } else if (formValsUploadFrag.savedFile.uploadType === "tus") {
            yield call(
                onDatasetCreateUpdateTUSUpload,
                metadataAndFile,
                path,
                internalID
            )
        }
    } else {
        yield put(
            apiActions.Creators.warning({
                message:
                    "Submission failed: Please check, if all required fields are filled properly"
            })
        )
    }
}
export function* onDatasetCreateWizard() {
    // load projects
    const activePage = yield select(getWizardActivePage)
    if (activePage === 1) {
        try {
            yield put(projectsActions.Creators.listFetchStart())

            const projects = yield call(readApiSafely, listProjects)
            const projectsIds = yield call(
                normalizeAndStore,
                projects,
                projectsSchema
            )
            yield put(projectsActions.Creators.listFetch(projectsIds))

            yield put(projectsActions.Creators.listFetchSuccess())
        } catch (err) {
            console.error("Error in saga for fetching list of projects - ", err)

            yield put(projectsActions.Creators.listFetchError(err))
        }
    }
}

export function* onDatasetUploadLeave() {
    yield put(destroy("datasetToUpload"))
    yield put(Actions.Creators.reqProgressStatus(null, null, null, null, null))
}

export function* onDatasetCreateWizardLeave() {
    yield put(destroy("dsCreateWizard"))
    yield put(destroy("datasetToUpload"))
    yield put(Actions.Creators.reqProgressStatus(null, null, null, null, null))
}

export function* onEditorSaveFile({
    internalID,
    path,
    fileName,
    projectShortName,
    access,
    zone
}) {
    try {
        const fileID = yield getFileID(
            internalID,
            path,
            fileName,
            projectShortName,
            zone
        )
        const fileContent = window.localStorage.getItem(fileID)
        if (fileContent) {
            /**
             * @type {Blob}
             */
            const blob = new File([fileContent], decodeURIComponent(fileName))
            const predictedBase64Size = predictSizeOfbase64(blob.size)
            const reqData = {
                savedFile: {
                    file: [blob],
                    fileType: "file"
                },
                access,
                project: projectShortName,
                zone
            }
            if (predictedBase64Size < config.DSzonesBodySizeLimit[zone]) {
                yield call(
                    onDatasetCreateUpdateDirectUpload,
                    reqData,
                    decodeURIComponent(path),
                    internalID
                )
            } else {
                yield call(
                    onDatasetCreateUpdateTUSUpload,
                    reqData,
                    decodeURIComponent(path),
                    internalID
                )
            }
            window.localStorage.removeItem(fileID)
        }
    } catch (e) {
        yield put(
            apiActions.Creators.warning(
                "Some errors occured while preparation of saving file"
            )
        )
        console.error(e)
    }
}
