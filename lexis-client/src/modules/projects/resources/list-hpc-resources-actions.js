import { createActions } from "reduxsauce"

export default createActions(
    {
        listFetchStart: null,   // { type: 'HPC_RESOURCES_LIST_FETCH_START', fetchInProgress: true }
        listFetch: ["ids"],        // { type: 'HPC_RESOURCES_LIST_FETCH' },
        listFetchSuccess: null, // { type: 'HPC_RESOURCES_LIST_FETCH_SUCCESS', fetchInProgress: false }
        listFetchError: ["err"] // { type: 'HPC_RESOURCES_LIST_FETCH_ERROR', fetchInProgress: false + err: Error }
    },
    {
        prefix: "HPC_RESOURCES_",
    }
)
