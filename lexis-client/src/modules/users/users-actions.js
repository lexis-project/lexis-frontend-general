import { createActions } from "reduxsauce"

//keys of object passed in will become keys/values of the Types
//after being converted to SCREAMING_SNAKE_CASE
export default createActions(
    {
        create: ["data", "usrname"], // { type: "USERS_CREATE", data: XYZ, usrnm: zyx }
        update: ["data"], // { type: "USERS_UPDATE", data: XYZ }
        listFetchStart: null, // { type: 'USERS_FETCH_START', fetchInProgress: true }
        listFetched: ["ids"], // { type: "USERS_LIST_FETCHED", ids: XYZ }
        listFetchSuccess: null, // { type: 'USERS_FETCH_SUCCESS', fetchInProgress: false }
        listFetchError: ["err"], // { type: 'USERS_FETCH_ERROR', fetchInProgress: false + err: Error }
        remove: ["id"], // { type: "USERS_REMOVE", id: XYZ }
        setRole: ['userID', 'role', 'orgID', 'prjID', 'prjShortName'],
        showErrors: ["errors"], // type USERS_SHOW_ERRORS
        setRoleDone: null
    },
    {
        prefix: "USERS_", // prepend the `USERS_` string to all created types
    }
)
