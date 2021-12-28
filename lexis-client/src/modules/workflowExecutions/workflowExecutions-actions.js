import { createActions } from "reduxsauce"

export default createActions(
    {
        createStart: ["isInProgress"],
        create: ["data"],
        createSuccess: ["isSuccessful"],
        createError: ["err"],
        wfeFetchStart: null,
        wfeFetch: ["workflowExecution"],
        wfeFetchSuccess: null,
        wfeFetchError: ["err"],
        statusFetchStart: null,
        statusFetch: ["workflowExecutionStepStatus"],
        statusFetchSuccess: null,
        statusFetchError: ["err"],
        listFetchStart: null,
        listFetch: ["workflowExecutionIds"],
        listFetchSuccess: null,
        listFetchError: ["err"],
        logsFetchStart: null,
        logsFetch: ["workflowExecutionLogs"],
        logsFetchSuccess: null,
        logsFetchError: ["err"],
        cancel: ["workflowExecutionId"],
        deleteStart: ["isInProgress"],
        remove: ["workflowExecutionId"],
        deleteSuccess: ["isSuccesful"],
        deleteError: ["err"],
        executeBatch: ["fData"],
        batchError: ["err"],
        batchErrorReset: null,
        batchStatusChange: ["done"],
        batchStatusReset: null,
        adHpFlFetch: ["additionalHeappeFields"]
    },
    {
        prefix: "WORKFLOWEXECUTIONS_",
    }
)
