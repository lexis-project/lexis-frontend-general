import { createActions } from "reduxsauce"

export default createActions(
    {
        listFetchStart: null,
        listFetch: ["workflowTemplateIds"],
        listFetchSuccess: null,
        listFetchError: ["err"],
        uploadStart: ["isInProgress"],
        upload: ["data"],
        uploadSuccess: ["isSuccessful"],
        uploadError: ["err"],
    },
    {
        prefix: "WORKFLOWTEMPLATES_",
    }
)
