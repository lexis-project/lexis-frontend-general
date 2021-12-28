import { createActions } from "reduxsauce"

export default createActions(
    {
        createStart: null,
        create: ["data"],
        createSuccess: null,
        createError: ["err"],
        listFetchStart: null,
        listFetch: ["workflowIds"],
        listFetchSuccess: null,
        listFetchError: ["err"],
        removeStart: null,
        remove: ["workflowId"],
        removeSuccess: null,
        removeError: ["err"],
    },
    {
        prefix: "WORKFLOWS_",
    }
)
