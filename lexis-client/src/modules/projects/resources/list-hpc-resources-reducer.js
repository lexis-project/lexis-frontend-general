import { createReducer } from "reduxsauce"

import Actions from "./list-hpc-resources-actions"

const INITIAL_STATE = {
    list: [],
    fetchInProgress: false,
    error: null,
}

const onListFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    error: null,
})

const onListFetch = (state, { ids }) => ({
    ...state,
    list: ids,
    fetchInProgress: true,
    error: null,
})

const onListFetchSuccess = state => ({
    ...state,
    fetchInProgress: false,
    error: null,
})

const onListFetchError = (state, { err }) => ({
    ...state,
    fetchInProgress: false,
    error: err,
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCH_START]: onListFetchStart,
    [Actions.Types.LIST_FETCH]: onListFetch,
    [Actions.Types.LIST_FETCH_SUCCESS]: onListFetchSuccess,
    [Actions.Types.LIST_FETCH_ERROR]: onListFetchError,
}

export default createReducer(INITIAL_STATE, HANDLERS)
