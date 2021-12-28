import JSZip from "../../includes/jszip"
import config from '../../config'
import {
    all,
    call,
    put,
    fork,
    select,
    takeLatest,
    takeEvery,
    take,
    delay,
    cancel,
} from "redux-saga/effects"
import { channel } from "redux-saga"

import Actions from "./data-sets-actions"
import { actions as routerActions } from "redux-router5"

import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import { ToastsStore } from "react-toasts"

import {
    datasets as datasetsSchema,
    datasetFilelist as datasetFilelistSchema,
    datasetZip as datasetZipSchema,
    DownloadMulti as DownloadMultiSchema,
    StageDownload as StageDownloadSchema,
} from "../api/schema"
import {
    ROUTE_DATA_SETS_LIST,
    ROUTE_DATA_SETS_FILELIST,
    ROUTE_DATA_SETS_DETAIL,
    ROUTE_DATA_SETS_CREATEWIZARD,
    ROUTE_DATA_SETS_FILEUPLOAD,
    ROUTE_DATA_SETS_EDITOR_FILE,
    ROUTE_DATA_SETS_UPDATE_META,
    ROUTE_DATA_SETS_STAGE,
    ROUTE_DATA_SETS_REPLICATE,
    ROUTE_DATA_SETS_DUPLICATE
} from "../routing/routes"
import { onRouteEnter, onRouteLeave } from "../routing/on-route-enter"
import {
    readApiSafely,
    deleteApiSafelyOr40X,
    createApiSafely,
    createApiSafelyOr40X,
    queueApiSafely,
    readApiSafelyOr40X,
    deleteApiSafely,
} from "../api/api-saga"
import {
    listDataSets,
    downloadDataSet,
    filelistDataSet,
    updateDataSetMetadata,
    gridmapAdd,
    gridmapRemove,
    stageDeleteDataset,
    sshAdd,
    sshRemove,
    requestPID,
    multipart,
    dataSize,
    queryMultipart,
    stagedownload,
    postCreateDataset,
} from "../api/client"
import {
    getDataSetLocation,
    getDataSetQuery,
    getUpdatedMetadata,
    getGridmapAdd,
    getGridmapRemove,
    getDataSetDetailInternalID,
    getIsFirstMetadatQueried,
    getFetchingStateOfDatasets,
} from "./data-sets-selectors"
import {
    getDataSetsList as getDataSetsListER,
    getDataSetsList,
    getDataSetsFilelist,
} from "../entity-repository/entity-repository-selectors"

import { getUserFinePerms, getUserName } from "../auth/auth-selectors"

import { getRouteParams } from "../routing/routing-selectors"

import { stagePath } from "./data-sets-utils"
import { ForbiddenException } from "../api/exceptions/forbidden-exception"

import {
    onDatasetCreateUploadSubmit,
    onDatasetCreateWizard,
    onDatasetCreateWizardLeave,
    onDatasetUploadLeave,
    onEditorSaveFile,
    onUploadIntoExisting,
    reqProgressListener,
    reqStatusListener,
} from "./saga-submodules/data-sets-saga-upload"
import { onRequestReplica } from "./data-sets-replica/data-sets-replica-saga"
import { onRequestDuplicate } from "./data-sets-duplicate/data-sets-duplicate-saga"
import { onRequestStage } from "./data-sets-stage/data-sets-stage-saga"
import apiActions from "../api/api-actions"
import { getFileID } from "../utils"
import { checkFineReadPerms } from "../auth/auth-check-fine-perms"
import { UnauthorizedException } from "../api/exceptions/unauthorized-exception"
import { dataSetsSagaQueue, openNewTabWithReqStatus } from "./saga-submodules/data-sets-saga-queue"
import { isEqual } from "lodash"

const chan = channel()
const stagedownload_chan = channel()

function* downloadUpdate() {
    while (true) {
        const res = yield take(chan)
        yield put(Actions.Creators.downloadUpdated(res))
    }
}

function* stagedownloadUpdate() {
    while (true) {
        const res = yield take(stagedownload_chan)
        yield call(normalizeAndStore, res, StageDownloadSchema)
    }
}

function* onQueryAndNavigate(action) {
    yield put(routerActions.navigateTo(ROUTE_DATA_SETS_LIST, {}))
    yield put(Actions.Creators.requestMetadataQuery(action.data))
}

function* onRequestMetadataQuery({data, forceQuery}) {
    const firstMetaQueried = yield select(getIsFirstMetadatQueried)
    if(firstMetaQueried === false){yield put(Actions.Creators.firstMetaQuery())}
    if(data instanceof Object 
    && ( Object.keys(data).length > 0 || !firstMetaQueried || forceQuery))
    {
        try {
            yield put(Actions.Creators.listFetchStart())

            const query = data ? data : {}
            let statusList = {
                message: "Update of Dataset List in progress",
                query: query,
            }
            yield put(Actions.Creators.statusListChanged(statusList))
            const dataSets = yield call(readApiSafely, listDataSets, query)
            statusList = { message: null, query: query }
            yield put(Actions.Creators.statusListChanged(statusList))
            const dataSetsInternalID = yield call(
                normalizeAndStore,
                dataSets,
                datasetsSchema
            )
            yield put(Actions.Creators.listFetched(dataSetsInternalID))

            yield put(Actions.Creators.listFetchSuccess())
        } catch (err) {
            console.error("Error in saga for fetching list of projects - ", err)

            yield put(Actions.Creators.listFetchError(err))
        }
    }
    yield put(Actions.Creators.listFetchSuccess())
}

function* onMetadataQueryOptimizedHandler(){
    let prevReqData = null
    let fetchInProgress = null
    while(true){
        const {data, forceQuery} = yield take(
            Actions.Types.REQUEST_METADATA_QUERY)
        if(!isEqual(data, prevReqData) || forceQuery){
            fetchInProgress = yield select(getFetchingStateOfDatasets)
            while(fetchInProgress) {
                yield delay(500)
                fetchInProgress = yield select(getFetchingStateOfDatasets)
            }
            yield call(onRequestMetadataQuery, {data: prevReqData = data, forceQuery})
        }
    }
}

//rgh: information for later https://stackoverflow.com/questions/35206589/how-to-download-fetch-response-in-react-as-file
function* onZip(internalID, access, project, path, zone, uncompress) {
    yield call(onDetail)

    const datasetzip = yield call(
        readApiSafely,
        downloadDataSet,
        internalID,
        access,
        project,
        zone,
        path,
        'zip'
    )
    let indexedZip = {}
    indexedZip.blob = datasetzip
    let dataSetsZipStored
    if (uncompress === true) {
        let new_zip = new JSZip()
        // load zip archive
        const files = yield call(() => new_zip.loadAsync(indexedZip.blob))

        // asynchronously prepare blob data
        const dec = Object.keys(files.files).map(e =>
            new_zip.files[e].async("blob")
        )

        // wait for all promises of preparing blob data
        const uncompressedFiles = yield call(a => Promise.all(a), dec)

        yield put(
            Actions.Creators.imageUrlPrepared(
                window.URL.createObjectURL(uncompressedFiles[0])
            )
        )
        indexedZip.uncompressed = uncompressedFiles
        indexedZip.files = files.files
        dataSetsZipStored = yield call(
            normalizeAndStore,
            { ...indexedZip, internalID, path },
            datasetZipSchema
        )
    } else {
        dataSetsZipStored = yield call(
            normalizeAndStore,
            { ...indexedZip, internalID, path },
            datasetZipSchema
        )
    }
    yield put(Actions.Creators.zipFetched(dataSetsZipStored))
    yield put(Actions.Creators.downloadUpdated(undefined))
    return indexedZip
}

function* onFilelist() {
    yield call(onDetail)

    const location = yield select(getDataSetLocation)
    const perms = yield select(getUserFinePerms)
    if(location && checkFineReadPerms(location.project, 'dat_short', perms, location.access)) {
        try {
            const filelist = yield call(readApiSafely, filelistDataSet, location.internalID, location.access, location.project, location.zone)
            const internalID = yield select(getDataSetDetailInternalID)
            yield call(
                normalizeAndStore,
                { ...filelist, internalID },
                datasetFilelistSchema
            )
            yield put(Actions.Creators.filelistFetched(internalID))
        } catch (ex) {
            switch (ex) {
            case ForbiddenException:
                yield ToastsStore.warning(
                    "You are not authorized to view this dataset",
                    12000
                )
                break
            default:
                yield ToastsStore.warning(
                    "Dataset does not exist or unexpected error",
                    12000
                )
            }
        }
    }
}

function* onGridmapAdd(action) {
    const data = yield select(getGridmapAdd)
    const ret = yield call(createApiSafelyOr40X, gridmapAdd, data)
    if (ret !== undefined && ret[2] === 201)
        yield ToastsStore.success("DN added to Lexis B2STAGE", 12000)
    if (ret !== undefined && ret[2] === 403)
        yield ToastsStore.warning(
            "You are not authorized to add this user and DN",
            12000
        )
}

function* onGridmapRemove(action) {
    const data = yield select(getGridmapRemove)
    const ret = yield call(deleteApiSafelyOr40X, gridmapRemove, data)
    if (ret !== undefined && ret[2] === 204)
        yield ToastsStore.success("Name removed from Lexis B2STAGE", 12000)
    if (ret !== undefined && ret[2] === 403)
        yield ToastsStore.warning(
            "User was not in Lexis B2Stage GridFTP or you are not authorized to remove them",
            12000
        )
}

function* onMetadataUpdate() {
    const location = yield select(getDataSetLocation)
    const metadata = yield select(getUpdatedMetadata)
    yield call(createApiSafely, updateDataSetMetadata, location, metadata)
    const query = yield select(getDataSetQuery)
    yield put(Actions.Creators.requestMetadataQuery(query,true))
    yield put(
        routerActions.navigateTo(ROUTE_DATA_SETS_DETAIL, {
            internalID: location.internalID
        })
    )
}

function* onRequestFileRemove({internalID, access, projectShortName, path, zone}) {
    try {
        ToastsStore.info('Requesting file deletion')
        const username = yield select(getUserName)
        let realPath = stagePath({access, project: projectShortName, internalID}, username)
        realPath = path ? `${realPath}/${path}` : realPath
        const res = yield call(deleteApiSafely,
            stageDeleteDataset,
            config.DSzonesToiRODSzones[zone],
            realPath)
        yield put(Actions.Creators.requestIdFetched(res.request_id,'datDeletion'))
        openNewTabWithReqStatus(res.request_id,'datDeletion')
    } catch(e){
        yield put(apiActions.Creators.internalServerError(`Request deletion of ${internalID}/${path} failed`))
        console.error(e)
    }
}

function* onList() {
    const params = yield select(getRouteParams)
    yield put(Actions.Creators.requestMetadataQuery({}, !!params.forceQuery))
}

function* onRequestStageDelete(action) {
    const stage = action.data
    ToastsStore.info('Requesting stage deletion')
    const ret = yield call(queueApiSafely, stageDeleteDataset, stage)
    openNewTabWithReqStatus(ret.request_id, 'datDeletion')
}

function* onRequestSshAdd(action) {
    const req = action.data
    const ret = yield call(createApiSafelyOr40X, sshAdd, req)
    if (ret !== undefined && ret[2] === 201) {
        const res = ret[1]
        yield ToastsStore.success(
            "Ssh export Created, mount using " + res.sshfs,
            0
        )
        yield put(
            Actions.Creators.sshAdd({
                user: res.user,
                sshfs: res.sshfs,
                path: req.path,
            })
        )
    }
    if (ret !== undefined && ret[2] === 403) {
        yield ToastsStore.warning(
            "User not authorized to create ssh exports",
            12000
        )
    }
    if (ret !== undefined && ret[2] === 400) {
        yield ToastsStore.warning(
            "Invalid parameters for ssh export: " + ret[0],
            12000
        )
    }
}

function* onRequestSshRemove(action) {
    const req = action.data
    const ret = yield call(deleteApiSafelyOr40X, sshRemove, req)
    if (ret !== undefined && ret[2] === 204) {
        yield ToastsStore.success("Ssh export removed", 12000)
    }
    if (ret !== undefined && ret[2] === 403) {
        yield ToastsStore.warning(
            "User not authorized to remove the ssh export",
            12000
        )
    }
}

function* onRequestPID({internalID, projectShortName, access, zone, parentPID}) {
    const username =  yield select(getUserName)
    const path = stagePath({access, project: projectShortName, internalID}, username)
    const system = config.DSzonesToiRODSzones[zone]
    try {
        ToastsStore.info('Requesting new PID...')
        const ret = yield call(readApiSafely, requestPID, system, path, parentPID)
        yield ToastsStore.success("PID requested", 12000)

        openNewTabWithReqStatus(ret.request_id,'newPID')

    } catch(e){
        switch (e.constructor) {
        case UnauthorizedException:
            yield ToastsStore.warning("User not authorized to request PID", 12000)
            break
        
        default:
            throw e
        }
    }
}


function* onRequestDataSize({ targetSystem, targetPath }) {
    try {
        ToastsStore.info('Requesting data size...')
        const { request_id } = yield call(
            readApiSafely,
            dataSize,
            targetSystem,
            targetPath
        )
        
        openNewTabWithReqStatus(request_id,'datasize')
    } catch(e){
        switch (e.constructor) {
        case UnauthorizedException:
            yield ToastsStore.warning("User not authorized to request PID", 12000)
            break
        
        default:
            throw e
        }
    }
}

function* onRequestMulti(action) {
    const size = action.data.size
    const params = yield select(getRouteParams)
    yield ToastsStore.success("Request starting")
    yield call(
        normalizeAndStore,
        { source_path: params.source_path, message: "Starting" },
        DownloadMultiSchema
    )
    const ret = yield call(createApiSafelyOr40X, multipart, {
        source_system: params.source_system,
        source_path: params.source_path,
        size: parseInt(size),
    })
    if (ret !== undefined && ret[2] === 201) {
        const res = ret[1]
        yield ToastsStore.success("Request queued: " + res.request_id, 0)
        yield call(
            normalizeAndStore,
            { source_path: params.source_path, message: "Request queued" },
            DownloadMultiSchema
        )
        //get path
        let ret2
        do {
            yield delay(1000)
            ret2 = yield call(readApiSafely, queryMultipart, res.request_id)
        } while (ret2.status === "In progress")
        yield ToastsStore.success("Request finished: " + ret2.status, 0)
        yield call(
            normalizeAndStore,
            {
                source_path: params.source_path,
                message: "Request finished: " + ret2.status,
            },
            DownloadMultiSchema
        )
        if (ret2.status !== "Multipart zip created!") {
            yield ToastsStore.error("Request failed")
            return
        }
        yield call(
            normalizeAndStore,
            {
                source_path: params.source_path,
                target_paths: ret2.target_paths,
            },
            DownloadMultiSchema
        )
        // normalize...
    }
    if (ret !== undefined && ret[2] === 403) {
        yield ToastsStore.warning("User not authorized", 12000)
    }
    if (ret !== undefined && ret[2] === 400) {
        yield ToastsStore.warning("Invalid parameters: " + ret[0], 12000)
    }
}
/**
 * 
 * @deprecated
 */
function* onRequestStageDownload(action) {
    const req = action.data
    const ret = yield call(
        readApiSafelyOr40X,
        stagedownload,
        { source_system: req.target_system, source_path: req.target_path },
        stagedownload_chan
    )
    if (ret !== undefined && ret[2] === 403) {
        yield ToastsStore.warning("File does not exist", 12000)
        yield call(
            normalizeAndStore,
            { target_path: req.target_path, blob: null },
            StageDownloadSchema
        )
    } else {
        yield call(
            normalizeAndStore,
            { target_path: req.target_path, blob: ret[1] },
            StageDownloadSchema
        )
    }
}

function* onDetail() {
    const datasetID = yield select(getDataSetDetailInternalID)
    const datasetER = yield select(getDataSetsListER)
    if (!(datasetER && datasetER[datasetID])) {
        const query = { internalID: datasetID }
        const datasets = yield call(readApiSafely, listDataSets, query)
        yield call(normalizeAndStore, datasets, datasetsSchema)
    }
}

function* onLoadImage({ internalID, access, project, path, zone, uncompress }) {
    ToastsStore.info('Downloading image...')
    const uncmprsdZip = yield call(
        onZip,
        internalID,
        access,
        project,
        path,
        zone,
        uncompress
    )
    ToastsStore.success('Image downloaded!')
    // generate url from first uncompressed image (archive contains only one file)
    yield put(
        Actions.Creators.imageUrlPrepared(
            window.URL.createObjectURL(uncmprsdZip.uncompressed[0])
        )
    )

    const requestOfCurrentImage = {
        internalID: internalID,
        access: access,
        project: project,
        path: path,
        zone: zone,
    }

    yield put(Actions.Creators.saveDownloadRequestOfCurrentImage(requestOfCurrentImage))
    yield put(Actions.Creators.changeImageBoxStatus(true))
}

function* scheduleLoadImage(loadImageArgs, interval) {
    yield call(onLoadImage, loadImageArgs)
    while (true) {
        yield delay(interval * 1000)
        yield call(onLoadImage, loadImageArgs)
    }
}

function* scheduleLoadImageWrap(loadImageArgs, interval) {
    const taskSchedule = yield fork(scheduleLoadImage, loadImageArgs, interval)
    let action
    while ((action = yield take(Actions.Types.CHANGE_IMAGE_BOX_STATUS))) {
        if (!action.status) {
            yield cancel(taskSchedule)
        }
    }
}
// schedule should be in seconds
function* onLoadImageWrap({
    internalID,
    access,
    project,
    path,
    zone,
    uncompress,
    schedule,
}) {
    if (Number.isInteger(schedule)) {
        // when is schedule set, then it will be used for calling load image in the intervals
        yield call(
            scheduleLoadImageWrap,
            { internalID, access, project, path, zone, uncompress },
            schedule
        )
    } else {
        yield call(onLoadImage, {
            internalID,
            access,
            project,
            path,
            uncompress,
        })
    }
}

function chooseDownloadZone(avaliableZones)
{
    if(avaliableZones.includes(config.preferedZone))
    {
        return config.preferedZone
    }
    return avaliableZones[0]
}


function* onLoadFile({ internalID, access, project, path, zone, fileName, isDir, zip }) {
    try {
        yield put(
            Actions.Creators.reqProgressStatus(
                "proccessing",
                0,
                null,
                null,
                "preparing download"
            )
        )

        if (isDir) {
            path = `${path}${fileName}`

            const dataset = yield call(
                readApiSafely,
                "downloadDataSet",
                downloadDataSet,
                internalID,
                access,
                project,
                chooseDownloadZone(zone),
                decodeURIComponent(path),
                "zip",
                reqProgressListener()
            )

            const url = window.URL.createObjectURL(dataset)

            const link = document.createElement("a")

            link.href = url
            link.setAttribute("download", "dataset.zip")            
            document.body.appendChild(link) // Append to html link element page
            link.click()    // Start download
            link.parentNode.removeChild(link)   // Clean up and remove the link

        } else {
            path = `${path}${fileName}`

            const dataset = yield call(
                readApiSafely,
                "downloadDataSet",
                downloadDataSet,
                internalID,
                access,
                project,
                zone,
                decodeURIComponent(path),
                zip ? "zip" : "file",
                reqProgressListener()
            )
            let dec
            if (zip) {
                let new_zip = new JSZip()
                
                yield call(() => new_zip.loadAsync(dataset))    // load zip archive
        
                if(!new_zip.files[fileName]){
                    throw new Error(`Missing requested file in ZIP file: ${fileName}`)
                }
        
                dec = yield call(() => new_zip.files[fileName].async("blob"))
        
            } else {
                dec = dataset
            }
    
            const url = window.URL.createObjectURL(dec)

            const link = document.createElement("a")

            link.href = url
            link.setAttribute("download", fileName)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        }

        yield put(Actions.Creators.reqProgressStatus(null, 0, null, null, null))
    } catch (e) {
        if (
            e instanceof Error &&
            e.message.includes("Corrupted zip: missing")
        ) {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Corrupted data."
                )
            )
            yield put(
                apiActions.Creators.warningException("Corrupted data.", 15000)
            )
            console.warn(e)
        } else if (
            e instanceof DOMException &&
            e.name === "QuotaExceededError"
        ) {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Sorry, file exceeded supported size... "
                )
            )
        } else {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Sorry, some unexpected error occured... " + e.message
                )
            )
            throw e
        }
    }
}

/**
 *
 * @param {string} id
 * @param {string} defContent
 * @returns
 */
function checkIfRestoreExistingLocalAndSave(id, defContent) {
    const item = window.localStorage.getItem(id)
    if (item && item !== defContent) {
        if (
            !window.confirm("Would you like to restore previous stored changes?")
        ) {
            window.localStorage.setItem(id, defContent)
        }
    } else { // case, when file does not exist in local storage
        window.localStorage.setItem(id, defContent)
    }
}

function* onFileEdit() {
    try {
        yield put(Actions.Creators.sourceEditorFileFetched(false))
        yield put(
            Actions.Creators.reqProgressStatus(
                "proccessing",
                0,
                null,
                null,
                "preparing download"
            )
        )
        yield fork(onDetail)
        const {
            internalID,
            zone,
            dsPath,
            fileName,
            access,
            project,
        } = yield select(getRouteParams)
        const decodedFileName = decodeURIComponent(fileName)
        const decodedProject = decodeURIComponent(project)
        const decodedZone = decodeURIComponent(zone)
        const dataset = yield call(
            readApiSafely,
            "downloadDataSet",
            downloadDataSet,
            internalID,
            access,
            decodedProject,
            decodedZone,
            decodeURIComponent(`${dsPath}${fileName}`),
            "zip",
            reqProgressListener()
        )

        let new_zip = new JSZip()
        // load zip archive
        yield call(() => new_zip.loadAsync(dataset))
        
        if(!new_zip.files[decodedFileName]){
            throw new Error(`Missing requested file in ZIP file: ${decodedFileName}`)
        }

        /**
         * asynchronously prepare blob data
         * @type {Blob}
         */
        const dec = yield call(() => new_zip.files[decodedFileName].async("blob"))

        const fileContent = yield dec.text()
        const fileID = yield getFileID(internalID, decodeURIComponent(dsPath), decodedFileName, decodedProject, decodedZone)

        checkIfRestoreExistingLocalAndSave(fileID, fileContent)

        yield put(Actions.Creators.sourceEditorFileFetched(true))
        yield put(Actions.Creators.reqProgressStatus(null, 0, null, null, null))
    } catch (e) {
        if (
            e instanceof Error &&
            e.message.includes("Corrupted zip: missing")
        ) {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Corrupted data. Unable to edit this file"
                )
            )
            yield put(
                apiActions.Creators.warningException(
                    "Corrupted data. Unable to edit this file",
                    15000
                )
            )
            console.warn(e)
        } else if(e instanceof DOMException && e.name === 'QuotaExceededError') {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Sorry, file exceeded supported size of implementation... "
                )
            )
        } else {
            yield put(
                Actions.Creators.reqProgressStatus(
                    "error",
                    0,
                    null,
                    null,
                    "Sorry, some unexpected error occured... " + e.message
                )
            )
            throw e
        }
    }
}

function* onRequestDelete({internalID}){
    let datasets = yield select(getDataSetsList)
    ToastsStore.info('Preparing deletion request')
    try {
        if(!datasets[internalID]) {
            const r = yield call(
                readApiSafely,
                listDataSets,
                {internalID}
            )
            const dataSetsInternalID = yield call(
                normalizeAndStore,
                r,
                datasetsSchema
            )
            yield put(Actions.Creators.listFetched(dataSetsInternalID))
            datasets = yield select(getDataSetsList)
        }
        const dataset = datasets[internalID]
        const {access, zone, project} = dataset.location
        const username = yield select(getUserName)

        ToastsStore.info('Requesting dataset content deletion',19000)

        const {request_id} = yield call(
            deleteApiSafely,
            stageDeleteDataset,
            config.DSzonesToiRODSzones[zone],
            stagePath({access, project, internalID}, username)
        )
        ToastsStore.info('Dataset content deletion accepted to queue', 19000)

        ToastsStore.info('Requesting dataset content deletion',19000)
        yield call(
            readApiSafely,
            postCreateDataset,
            'empty',
            undefined,
            undefined,
            undefined,
            undefined,
            internalID,
            access,
            project,
            {},
            undefined,
            undefined,
            zone
        )
        ToastsStore.info('Dataset metadata deleted')


        yield put(apiActions.Creators.success('Dataset successfuly added to deletion queue',19000))
        openNewTabWithReqStatus(request_id, 'datDeletion')
        
        yield delay(1000)
        yield put(routerActions.navigateTo(ROUTE_DATA_SETS_LIST, {}))
    } catch(e) {
        ToastsStore.error("Sorry something went wrong while deletion")
        console.error(e)
    }
}

function* requestDatasetContent({internalID, forceRequest}){
    try {
        const datasetsList = yield select(getDataSetsFilelist)
        if(forceRequest || !datasetsList[internalID]) {
            ToastsStore.info(`Downloading dataset content for ${internalID}`)
            const datasets = yield select(getDataSetsList)
            const {location} = datasets[internalID]
            const filelist = yield call(readApiSafely, filelistDataSet, internalID, location.access, location.project, location.zone)
            yield call(
                normalizeAndStore,
                { ...filelist, internalID },
                datasetFilelistSchema
            )
            yield put(Actions.Creators.filelistFetched(internalID))
        }
    } catch (ex) {
        switch (ex) {
        case ForbiddenException:
            yield ToastsStore.warning(
                `You are not authorized to read dataset files {${internalID}}`,
                12000
            )
            break
        default:
            yield ToastsStore.warning(
                "Dataset does not exist or unexpected error",
                12000
            )
        }
    }
}

export function* dataSetsSaga() {
    yield all([
        fork(dataSetsSagaQueue),
        fork(onMetadataQueryOptimizedHandler),
        fork(onRouteEnter, ROUTE_DATA_SETS_LIST, onList),
        fork(onRouteEnter, ROUTE_DATA_SETS_FILELIST, onFilelist),
        fork(onRouteEnter, ROUTE_DATA_SETS_DETAIL, onDetail),
        fork(onRouteEnter, ROUTE_DATA_SETS_STAGE, onDetail),
        fork(onRouteEnter, ROUTE_DATA_SETS_REPLICATE, onDetail),
        fork(onRouteEnter, ROUTE_DATA_SETS_DUPLICATE, onDetail),
        fork(onRouteEnter, ROUTE_DATA_SETS_UPDATE_META, onDetail),
        fork(onRouteEnter, ROUTE_DATA_SETS_EDITOR_FILE, onFileEdit),
        fork(onRouteEnter, ROUTE_DATA_SETS_CREATEWIZARD, onDatasetCreateWizard),
        fork(
            onRouteLeave,
            ROUTE_DATA_SETS_CREATEWIZARD,
            onDatasetCreateWizardLeave
        ),
        fork(onRouteLeave, ROUTE_DATA_SETS_FILEUPLOAD, onDatasetUploadLeave),
        takeEvery(Actions.Types.RESET_UPLOAD, onDatasetUploadLeave),
        takeEvery(Actions.Types.RESET_UPLOAD_WIZ, onDatasetCreateWizardLeave),
        takeLatest(Actions.Types.REQUEST_FILELIST_UPDATE, onFilelist),
        takeLatest(Actions.Types.QUERY_AND_NAVIGATE, onQueryAndNavigate),
        takeLatest(Actions.Types.REQUEST_METADATA_UPDATE, onMetadataUpdate),
        takeLatest(
            Actions.Types.SUBMIT_WIZARD_UPLOAD,
            onDatasetCreateUploadSubmit
        ),
        takeLatest(Actions.Types.UPLOAD_INTO_EXISTING, onUploadIntoExisting),
        takeLatest(Actions.Types.REQUEST_FILE_REMOVE, onRequestFileRemove),
        takeLatest(Actions.Types.REQUEST_GRIDMAP_ADD, onGridmapAdd),
        takeLatest(Actions.Types.REQUEST_GRIDMAP_REMOVE, onGridmapRemove),
        takeLatest(Actions.Types.UPLOAD_EDITOR_CONTENT, onEditorSaveFile),
        takeLatest(Actions.Types.DELETE, onRequestDelete),
        takeEvery(Actions.Types.REQUEST_REPLICA, onRequestReplica),
        takeEvery(Actions.Types.REQUEST_DUPLICATE, onRequestDuplicate),
        takeEvery(Actions.Types.REQUEST_STAGE, onRequestStage),
        takeEvery(Actions.Types.REQUEST_PID, onRequestPID),
        takeEvery(Actions.Types.REQUEST_STAGE_DELETE, onRequestStageDelete),
        takeEvery(Actions.Types.REQUEST_SSH_ADD, onRequestSshAdd),
        takeEvery(Actions.Types.REQUEST_SSH_REMOVE, onRequestSshRemove),
        takeEvery(Actions.Types.REQUEST_MULTI, onRequestMulti),
        takeEvery(Actions.Types.REQUEST_DATA_SIZE, onRequestDataSize),
        takeEvery(Actions.Types.REQUEST_STAGE_DOWNLOAD, onRequestStageDownload),
        takeEvery(Actions.Types.LOAD_IMAGE, onLoadImage), // load image from dataset
        takeEvery(Actions.Types.LOAD_IMAGE_SCHEDULED, onLoadImageWrap), // load image from dataset
        takeEvery(Actions.Types.LOAD_FILE, onLoadFile),
        takeEvery(Actions.Types.REQUEST_DATASET_CONTENT, requestDatasetContent),
        downloadUpdate(),
        stagedownloadUpdate(),
        reqStatusListener(),
    ])
}
