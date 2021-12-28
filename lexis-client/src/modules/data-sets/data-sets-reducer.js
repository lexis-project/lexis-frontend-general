import { createReducer } from "reduxsauce"

import Actions from "./data-sets-actions"

const INITIAL_STATE = {
    list: [], //for each dataset, its metadata
    filelist: [], //for each dataset, its file list and directory structure
    /**
     * @type {String}
     */
    zip: null, // downloaded dataset in zip format
    /**
     * @type {boolean}
     */
    editorSource: null, // source content of file to edit is ready
    metadataPlus: {}, //metadata of currently created dataset plus project and access information
    gridmapAdd: {}, //content of the gridmapAdd form
    gridmapRemove: {}, //content of the gridmaRemove form
    firstMetadatQueried: false,
    query: undefined, //current metadata query for dataset filtering
    del: [null, null, null], //internalID, api response and information message for a stage delete api call.
    statusList: undefined, //information about the progress of various background api calls
    downloadProgress: undefined, //information about the current procress of a dataset download (zip format)
    stagingZones: undefined, // possible destinations for staging
    stage: [], // parameters to the stage api endpoint
    stageDelete: [], //parameters to the stage delete api endpoint
    ssh: undefined, //parameters for the ssh add api endpoint
    fetchInProgress: false, // for fetching state of dataset list (1st item in this object)
    errorFetch: null, // for fetching error of list of datasets
    imageURL: null, // url of prepared image file from blob, downloaded from data-set
    imageBoxStatus: false,
    reqProgressStatus: { status: null, progress: 0, upDownSpeed: null, remainingTime: null, errorString: null },
    requestOfCurrentImage: {}, // to save request's data of currently opened image in lightbox
    requestIDs: null
}

const onReqProgressStatusChange = (state, {status, progress, upDownSpeed, remainingTime, errorString}) => {
    if (status === 'cancel' || status === 'pause' || status === 'continue') return state
    if (status === 'paused') return {...state,
        reqProgressStatus: {
            status,
            progress: state.reqProgressStatus.progress,
            upDownSpeed,
            remainingTime,
            errorString
        }
    }
    return ({
        ...state,
        reqProgressStatus: {status, progress, upDownSpeed, remainingTime, errorString}
    })}

const onSourceEditorFileFetched = (state, { fileSource }) => {
    return ({
        ...state,
        editorSource: fileSource
    })
}

const onResetSourceEditorFile = (state) => {
    return ({
        ...state,
        editorSource: null
    })
}

const onRequestStage = (state, stage) => ({
    ...state,
    stage: stage.data,
})

const onRequestStageDelete = (state, stage) => ({
    ...state,
    stageDelete: stage.data,
})

const onSshfsAdd = (state, add) => ({
    ...state,
    ssh: add.data,
})

const onFinishedStagingZones = (state, zones) => ({
    ...state,
    stagingZones: zones.data,
})

const onListFetched = (state, internalIDs) => ({
    ...state,
    list: internalIDs.data,
    fetchInProgress: true,
    errorFetch: null,
})

const onFilelistFetched = (state, internalID) => ({
    ...state,
    filelist: internalID.data,
})

const onZipFetched = (state, internalID) => ({
    ...state,
    zip: internalID.data,
})

const onRequestMetadataQuery = (state, {data}) => ({
    ...state,
    query: data === undefined ? state.query : data,
})

const onStatusListChanged = (state, liststatus) => ({
    ...state,
    statusList: liststatus.data,
})

const onDownloadUpdated = (state, progress) => ({
    ...state,
    downloadProgress: progress.data,
})

const onCreate = (state, metadata) => ({
    ...state,
    metadataPlus: metadata.data,
})

const onGridmapAdd = (state, data) => ({
    ...state,
    gridmapAdd: data.data,
})

const onGridmapRemove = (state, data) => ({
    ...state,
    gridmapRemove: data.data,
})

const onListFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    errorFetch: null,
})

const onListFetchSuccess = state => ({
    ...state,
    fetchInProgress: false,
    errorFetch: null,
})

const onListFetchError = (state, { err }) => ({
    ...state,
    fetchInProgress: false,
    errorFetch: err,
})

const onImageUrlPrepared = (state, { url }) => ({
    ...state,
    imageURL: url
})

const onImageBoxStatusChange = (state, { status }) => status === false ?
    ({
        ...state,
        imageURL: undefined,
        imageBoxStatus: false
    })
    : ({
        ...state,
        imageBoxStatus: true
    })

const onSaveDownloadRequestOfCurrentImage = (state, { imageRawData }) => ({
    ...state,
    requestOfCurrentImage: imageRawData,
})

const onRequestIDFetched = (state, { id, reqType, status, creation, lastCheck, data }) => {
    const prevState = state.requestIDs && state.requestIDs[reqType] && state.requestIDs[reqType][id]
    const creationVal = prevState ? prevState.creation : creation
    const lastCheckVal = prevState && !lastCheck ? prevState.lastCheck : lastCheck
    const statusVal = prevState && !status ? prevState.status : status
    const dataVal = prevState ? {...prevState.data, ...data} : data
    const reqIDs = state.requestIDs ? state.requestIDs : {}
    return({
        ...state,
        requestIDs: {...reqIDs,
            [reqType]: {
                ...reqIDs[reqType],
                [id]: {
                    id,
                    status: statusVal,
                    creation: creationVal,
                    lastCheck: lastCheckVal,
                    data: {
                        ...dataVal
                    }
                }
            }
        }
    })
}

const onRequestIDsFetched = (state, {requests}) => {
    return requests
        .reduce((prevState, request) => {
            const { id, reqType, status, creation, lastCheck, data } = request
            return onRequestIDFetched(prevState, { id, reqType, status, creation, lastCheck, data })
        }, state)
}

const onFirstMetaQuery = (state) => ({
    ...state,
    firstMetadatQueried: true,
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCHED]: onListFetched,
    [Actions.Types.FILELIST_FETCHED]: onFilelistFetched,
    [Actions.Types.ZIP_FETCHED]: onZipFetched,
    [Actions.Types.STAGING_ZONES_FETCHED]: onFinishedStagingZones,
    [Actions.Types.REQUEST_STAGE]: onRequestStage,
    [Actions.Types.REQUEST_STAGE_DELETE]: onRequestStageDelete,
    [Actions.Types.REQUEST_METADATA_QUERY]: onRequestMetadataQuery,
    [Actions.Types.STATUS_LIST_CHANGED]: onStatusListChanged,
    [Actions.Types.DOWNLOAD_UPDATED]: onDownloadUpdated,
    [Actions.Types.REQUEST_METADATA_UPDATE]: onCreate,
    [Actions.Types.REQUEST_METADATA_SAVE]: onCreate,
    [Actions.Types.REQUEST_GRIDMAP_ADD]: onGridmapAdd,
    [Actions.Types.REQUEST_GRIDMAP_REMOVE]: onGridmapRemove,
    [Actions.Types.SSH_ADD]: onSshfsAdd,
    [Actions.Types.LIST_FETCH_START]: onListFetchStart,
    [Actions.Types.LIST_FETCH_SUCCESS]: onListFetchSuccess,
    [Actions.Types.LIST_FETCH_ERROR]: onListFetchError,
    [Actions.Types.IMAGE_URL_PREPARED]: onImageUrlPrepared,
    [Actions.Types.CHANGE_IMAGE_BOX_STATUS]: onImageBoxStatusChange,
    [Actions.Types.REQ_PROGRESS_STATUS]: onReqProgressStatusChange,
    [Actions.Types.SOURCE_EDITOR_FILE_FETCHED]: onSourceEditorFileFetched,
    [Actions.Types.SOURCE_EDITOR_FILE_RESET]: onResetSourceEditorFile,
    [Actions.Types.SAVE_DOWNLOAD_REQUEST_OF_CURRENT_IMAGE]: onSaveDownloadRequestOfCurrentImage,
    [Actions.Types.REQUEST_ID_FETCHED]: onRequestIDFetched,
    [Actions.Types.FIRST_META_QUERY]: onFirstMetaQuery,
    [Actions.Types.REQUEST_IDS_FETCHED]: onRequestIDsFetched
}

export default createReducer(INITIAL_STATE, HANDLERS)
