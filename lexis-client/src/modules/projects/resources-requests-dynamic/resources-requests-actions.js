import { createActions } from "reduxsauce"

export default createActions(
    {
        listFetchStart: null, // { type: 'PROJECT_RESOURCES_REQUESTS_LIST_FETCH_START', fetchInProgress: true }
        listFetch: ["ids"], // { type: 'PROJECT_RESOURCES_REQUESTS_LIST_FETCH', ids: XYZ + fetchInProgress: true},
        listFetchSuccess: null, // { type: 'PROJECT_RESOURCES_REQUESTS_LIST_FETCH_SUCCESS', fetchInProgress: false }
        listFetchError: ["err"], // { type: 'PROJECT_RESOURCES_REQUESTS_LIST_FETCH_ERROR', fetchInProgress: false + err: Error }
    },
    {
        prefix: "PROJECT_RESOURCES_REQUESTS_",
    }
)
