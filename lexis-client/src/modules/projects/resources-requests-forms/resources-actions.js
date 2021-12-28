import { createActions } from "reduxsauce"

export default createActions(
    {
        create: ["data"], // { type: 'PROJECT_RESOURCE_CREATE', data: XYZ }
        createApproved: ["data"], // { type: 'PROJECT_RESOURCE_CREATE_APPROVED', data: XYZ }
        listFetched: ["ids"], // { type: 'PROJECT_RESOURCE_LIST_FETCHED', ids}
    },
    {
        prefix: "PROJECT_RESOURCE_",
    }
)
