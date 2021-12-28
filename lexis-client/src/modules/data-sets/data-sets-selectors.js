import { createSelector } from "reselect"
import { getDataSets as getState, getForms } from "../root/root-selectors"
import {
    getDataSetsList as getDataSetsER,
    getDataSetsFilelist as getDataSetsFilelistER,
    getDataSetsZip as getDataSetsZipER,
} from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"

export const getFetchingStateOfDatasets = createSelector(
    getState,
    state => state.fetchInProgress
)

export const getStagingTarget = createSelector(
    getForms,
    state =>
        state.stage && state.stage.values && state.stage.values.target_system
)

export const getDatasetFileType = createSelector(
    getState,
    state => state.savedFile.fileType
)

export const getStagingSource = createSelector(
    getForms,
    state =>
        state.stage && state.stage.values && state.stage.values.source_system
)

export const getRandom = createSelector(getState, state => state.random)

export const getSsh = createSelector(getState, state => state.ssh)

export const getDataSets = createSelector(
    //get all! later get subset by metadata query
    getState,
    getDataSetsER,
    (state, entityRepo) =>
        state.list.map(datasetInternalID => entityRepo[datasetInternalID])
)

export const getDataSetDetailInternalID = createSelector(
    getRouteParams,
    routeParams => routeParams && decodeURIComponent(routeParams.internalID)
)

export const getDataSetPath = createSelector(
    getRouteParams,
    routeParams => routeParams.internalID + routeParams.path
)

export const getDataSetDetail = createSelector(
    getDataSetsER,
    getDataSetDetailInternalID,
    (entityRepo, internalID) => entityRepo[internalID]
)

export const getDataSetMetadata = createSelector(
    getDataSetDetail,
    dataset => dataset && dataset.metadata
)

export const getDataSetLocation = createSelector(
    getDataSetsER,
    getDataSetDetailInternalID,
    (entityRepo, internalID) =>
        entityRepo[internalID] && entityRepo[internalID].location
)

export const getDataSetEudat = createSelector(
    getDataSetsER,
    getDataSetDetailInternalID,
    (entityRepo, internalID) =>
        entityRepo[internalID] && entityRepo[internalID].eudat
)

export const getDataSetLocationAccess = createSelector(
    getDataSetsER,
    getDataSetDetailInternalID,
    (entityRepo, internalID) =>
        entityRepo[internalID] &&
        entityRepo[internalID].location &&
        entityRepo[internalID].location.access
)

export const getDataSetsProject = createSelector(
    getDataSetsER,
    getDataSetDetailInternalID,
    (entityRepo, internalID) =>
        entityRepo[internalID] &&
        entityRepo[internalID].location &&
        entityRepo[internalID].location.project
)

export const getDataSetsTargetSystem = createSelector(
    getRouteParams,
    routeParams => decodeURIComponent(routeParams.source_system)
)

export const getDataSetFilelist = createSelector(
    getDataSetsFilelistER,
    getDataSetDetailInternalID,
    (entityRepo, internalID) => entityRepo[internalID]
)

export const getDataSetZip = createSelector(
    getDataSetsZipER,
    getDataSetPath,
    (entityRepo, path) =>
        entityRepo[path]
)

export const getDownloadProgress = createSelector(
    getState,
    state => state.downloadProgress
)

export const getStatusList = createSelector(getState, state => state.statusList)
//getDataSetStatusListER;

export const getDataSetQuery = createSelector(getState, state => state.query)

export const getUploadResult = createSelector(
    getState,
    state => state.lastDatasetUploaded
)

export const getDataSetDel = createSelector(getState, state => state.del)

export const getUpdatedLocation = createSelector(getState, state => ({
    access: state.metadataPlus.access,
    project: state.metadataPlus.project,
}))

export const getUpdatedMetadata = createSelector(
    getState,
    //CustomMetadata and CustomMetadataSchema saved as strings, unpack before using

    state => {
        var res = {}
        Object.assign(res, state.metadataPlus)
        if (typeof res.CustomMetadata === "string") {
            res.CustomMetadata = JSON.parse(res.CustomMetadata)
        }
        if (res.CustomMetadataSchema !== undefined) {
            for (var i = 0; i < res.CustomMetadataSchema.length; i++)
                if (typeof res.CustomMetadataSchema[i] === "string") {
                    res.CustomMetadataSchema[i] = JSON.parse(
                        res.CustomMetadataSchema[i]
                    )
                }
        }
        delete res.access
        delete res.project
        return res
    }
)

export const getGridmapAdd = createSelector(getState, state => state.gridmapAdd)

export const getGridmapRemove = createSelector(
    getState,
    state => state.gridmapRemove
)

export const getStage = createSelector(getState, state => state.stage)

export const getStageDelete = createSelector(
    getState,
    state => state.stageDelete
)

export const getDatasetImageUrl = createSelector(
    getState,
    (state) => state.imageURL
)

export const getDatasetImageBoxStatus = createSelector(
    getState,
    (state) => state.imageBoxStatus
)

export const getWizardActivePage = createSelector(
    getRouteParams,
    (params) => params.activePage ? params.activePage : 1
)

export const getDSFragmentUploadUploadType = createSelector(
    getForms,
    (forms) => forms
            && forms.datasetToUpload
            && forms.datasetToUpload.values
            && forms.datasetToUpload.values.savedFile
            && forms.datasetToUpload.values.savedFile.uploadType
)

export const getDSToUploadFormValues = createSelector(
    getForms,
    (forms) => forms
            && forms.datasetToUpload
            && forms.datasetToUpload.values
)

export const getDSCreateWizardFormValues = createSelector(
    getForms,
    (forms) => forms
            && forms.dsCreateWizard
            && forms.dsCreateWizard.values
)

export const getDSReqProgStatus = createSelector(
    getState,
    (state) => state && state.reqProgressStatus
)

export const getEditorSource = createSelector(
    getState,
    (state) => state && state.editorSource
)

export const getDataForImageDownload = createSelector(
    getState,
    state => state.requestOfCurrentImage
)

export const getRequestTypeURL = createSelector(
    getRouteParams,
    params => params && params.type
)

export const getRequestIDURL = createSelector(
    getRouteParams,
    params => params && params.reqID
)

export const getRequestIDs = createSelector(
    getState,
    (state) => state && state.requestIDs
)

export const getIsFirstMetadatQueried = createSelector(
    getState,
    state => state && state.firstMetadatQueried
)

export const getRequestIDsByType = (state, ownProps) => createSelector(
    getRequestIDs,
    (reqIDs) => {
        return !!reqIDs && reqIDs[ownProps.type] &&
        reqIDs[ownProps.type] !== undefined ?
            reqIDs[ownProps.type] : []
    }
)(state)

export const isDatasetPublic = createSelector(
    getDataSetLocation,
    location => location && location.access === "public"
)

export const hasDatasetPid = createSelector(
    getDataSetEudat,
    eudat => eudat && (eudat.PID && typeof eudat.PID) === "string"
)