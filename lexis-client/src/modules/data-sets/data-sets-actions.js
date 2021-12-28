import { createActions } from "reduxsauce"

//keys of object passed in will become keys/values of the Types
//after being converted to SCREAMING_SNAKE_CASE
export default createActions(
    {
        //For each API call, two actions are created:
        //requestX: action to start the processing
        //XFetched: action to bring the results into the react store.
        uploadIntoExisting: ["internalID", "path", "projectShortName", "access", "zone"], //request upload of a file into a dataset
        resetUpload: null,
        resetUploadWiz: null,
        //This action is called in the saga to indicate progress of an upload:
        //Button clicked, file encoded, api submitted, response received
        listFetched: ["data"], // { type: "DATASETS_LIST_FETCHED", ids: XYZ } + fetchInProgress: true +  errorFetch: null
        stagingZonesFetched: ["data"], //staging zones are possible destionations for staging. Loaded via api on program start.
        requestFilelistUpdate: ["data"], //call api to retrieve filenames of a dataset
        remove: ["data"], // { type: "DATASETS_REMOVE", id: XYZ }
        removebyMetadata: ["data"], // { type: "DATASETS_REMOVEBYMETADATA
        filelistFetched: ["data"], // List of files (and properties thereof) of a dataset
        zipFetched: ["data"], // download of dataset in zip format succeeded
        requestMetadataQuery: ["data", "forceQuery"], //Retrieve the metadata of available datasets (with query)
        queryAndNavigate: ["data"], // perform metadata query, then navigate to dataset list.
        // requestMetadataDelete: ["data"], //User requested to delete all the datasets he can see. This is a "delete by metadata" api call.
        requestMetadataUpdate: ["data"], //update metadata of a given dataset
        requestMetadataSave: ["data"], //save the metadata in the metadata form into the react store. This will be used later on various api calls.
        requestGridmapAdd: ["data"], //gridmapapi calls
        requestGridmapRemove: ["data"],
        requestReplica: ["data"], // request dataset replica
        requestReplicaStatus: ["data"], // check the status of a replica request
        requestDuplicate: ["data"], // request dataset duplicate
        requestDuplicateStatus: ["data"], // check the status of a duplicate request
        requestStagingZones: ["data"], //staging zones are possible destionations for staging. Loaded via api on program start.
        requestStage: ["internalID", "source_system", "target_system", "datPath"], // stage of dataset
        requestStageStatus: ["data"], //check a status of stage of dataset
        requestStageDelete: ["data"], //stage deletion of dataset
        requestSshAdd: ["data"], //sshfs api.
        requestSshRemove: ["data"],
        requestFileRemove: ["internalID","access","projectShortName", "path", "zone"], //delete a file within a dataset
        requestDatasetContent: ['internalID', 'forceRequest'],
        requestPID: ["internalID", "projectShortName", "access", "zone", "parentPID"], //assign PID to dataset
        /**
         * @deprecated
         */
        // requestPID: ["data"], //assign PID to dataset
        requestViewUpdate: ["data"], // reload and update data from ddi
        delete: ["internalID"], //information about the staged delete of a dataset.
        statusListChanged: ["data"],
        downloadUpdated: ["data"], //we received some data from the back-end when downloading a dataset
        sshAdd: ["data"], //user requested his key be added to the sshfs api
        createRandom: ["data"], //this random is used to avoid accidental deletion of datasets. New random value requested.
        requestMulti: ["data"], //Request multipart compression and download of dataset
        requestStageDownload: ["data"], //Request download from staging zone to user
        requestDataSize: ["targetSystem", "targetPath"], // Request size of a dataset or subdataset
        listFetchStart: null, // { type: 'DATASETS_FETCH_START', fetchInProgress: true }
        listFetchSuccess: null, // { type: 'DATASETS_FETCH_SUCCESS', fetchInProgress: false }
        listFetchError: ["err"], // { type: 'DATASETS_FETCH_ERROR', fetchInProgress: false + err:
        imageUrlPrepared: ["url"], // { type: 'DATASETS_IMAGE_URL_PREPARED', url: "http://..." }
        loadImage: ["internalID", "access", "project", "path", "zone", "uncompress"],
        loadImageScheduled: ["internalID", "access", "project", "path", "zone", "uncompress", "schedule"],
        changeImageBoxStatus: ["status"],
        reqProgressStatus: ["status","progress", "upDownSpeed", "remainingTime", "errorString"], // status should be null or "proccessing"
        // or "sending" or "done" or "paused" or "pause" or "continue" or "cancel" or "cancelled" or "error"
        submitWizardUpload: null,
        sourceEditorFileReset: null,
        sourceEditorFileFetched: ["fileSource"],
        uploadEditorContent: ["internalID", "path", "projectShortName", "access", "zone", "fileName"],
        loadFile: ["internalID", "access", "project", "path", "zone", "fileName", "isDir", "zip"],
        saveDownloadRequestOfCurrentImage: ["imageRawData"], // request's object data of currently opened image in lightbox
        firstMetaQuery: null,
        requestIdFetched: ['id', 'reqType', 'status', 'creation', 'lastCheck', 'data'], // data contains info specific for request
        // type could be 'datDeletion', 'datasize', 'staging', 'replication', 'duplication', 'deletion', 'newPID'
        requestIdsFetched: ['requests'], // array of requestIdFetched
        checkRequestStatus: ['id', 'reqType'],
        checkPendingReqStatuses: ['reqType']
    },
    {
        prefix: "DATASETS_", // prepend the `DATASETS_` string to all created types
    }
)
