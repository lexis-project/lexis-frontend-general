import { createReducer } from "reduxsauce"

import Actions from "./organizations-actions"

const INITIAL_STATE = {
    list: [],
    users: []
};

const onListFetched = (state, { ids }) => ({
    ...state,
    list: ids,
})

const onUsersFetched = (state, { ids }) => ({
    ...state,
    users: ids
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCHED]: onListFetched,
    [Actions.Types.USERS_FETCHED]: onUsersFetched
};

export default createReducer(INITIAL_STATE, HANDLERS)
