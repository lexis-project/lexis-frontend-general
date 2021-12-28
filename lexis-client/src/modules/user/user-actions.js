import { createActions } from "reduxsauce"

export default createActions(
    {
        update: ["data"], // { type: "USER_PAGE_UPDATE", data: XYZ }
    },
    {
        prefix: "USER_PAGE_", // prepend the `USER_PAGE_` string to all created types
    }
)
