import { createActions } from "reduxsauce"

export default createActions(
    {
        listFetched: ["ids"], // { type: "DYNAMIC_RESOURCES_LIST_FETCHED", ids: XYZ }
    },
    {
        prefix: "DYNAMIC_RESOURCES_", // prepend the `DYNAMIC_RESOURCES_` string to all created types
    }
)
