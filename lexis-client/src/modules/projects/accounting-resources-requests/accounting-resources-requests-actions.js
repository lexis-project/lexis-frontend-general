import { createActions } from "reduxsauce"

export default createActions(
    {
        fetched: ["lexisProjectID"], // { type: "USAGE_ACCOUNT_INFO_FETCHED", lexisProjectID: XYZ }
    },
    {
        prefix: "USAGE_ACCOUNT_INFO_", // prepend the `USAGE_ACCOUNT_INFO_` string to all created types
    }
)
