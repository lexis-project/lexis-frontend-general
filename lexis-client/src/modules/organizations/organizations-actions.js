import { createActions } from "reduxsauce"

//keys of object passed in will become keys/values of the Types
//after being converted to SCREAMING_SNAKE_CASE
export default createActions(
    {
        create: ["data"],     // { type: "ORGANIZATIONS_CREATE", data: XYZ }
        update: ["data"],     // { type: "ORGANIZATIONS_UPDATE", data: XYZ }
        listFetched: ["ids"], // { type: "ORGANIZATIONS_LIST_FETCHED", ids: XYZ }
        remove: ["id"],       // { type: "ORGANIZATIONS_REMOVE", id: XYZ }
        fetchOne: ["id"],      // { type: "ORGANIZATIONS_FETCH_ONE", id: XYZ }
        usersFetched: ['ids'],
        setMgr: ['id']
    },
    {
        prefix: "ORGANIZATIONS_" // prepend the `ORGANIZATIONS_` string to all created types
    }
);
