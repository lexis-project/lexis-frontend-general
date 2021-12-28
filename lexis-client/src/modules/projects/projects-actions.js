import { createActions } from "reduxsauce"

// keys of object passed in will become keys/values of the Types
// after being converted to SCREAMING_SNAKE_CASE
export default createActions(
    {
        create: ["data"], // { type: 'PROJECT_CREATE', data: XYZ }
        update: ["data"], // { type: 'PROJECT_UPDATE', data: XYZ }
        listFetchStart: null, // { type: 'PROJECT_LIST_FETCH_START', fetchInProgress: true }  
        listFetch: ["ids"], // { type: 'PROJECT_LIST_FETCH', ids: XYZ + fetchInProgress: true},
        listFetchSuccess: null, // { type: 'PROJECT_LIST_FETCH_SUCCESS', fetchInProgress: false }
        listFetchError: ["err"], // { type: 'PROJECT_LIST_FETCH_ERROR', fetchInProgress: false + err: Error }
        usersFetch: ["ids"], // { type: 'PROJECT_USERS_FETCH', ids: XYZ + fetchInProgress: true}
        showUserAddForm: null,
        assignUser: ['data'],
        setRole: ['id', 'role'],
        unassignUser: ['id']
    },
    {
        prefix: "PROJECT_" // prepend the `PROJECT_` string to all created types
    }
)
