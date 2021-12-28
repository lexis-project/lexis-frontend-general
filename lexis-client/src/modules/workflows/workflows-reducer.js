import { createReducer } from "reduxsauce"

import Actions from "./workflows-actions"

const INITIAL_STATE = {
    list: [],
    createInProgress: false,
    removeInProgress: false,
    fetchInProgress: false,
    error: null,
}

const onListFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    error: null,
})

const onListFetch = (state, { workflowIds }) => ({
    ...state,
    list: workflowIds,
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

const onCreateStart = state => ({
    ...state,
    createInProgress: true,
    error: null,
})

const onCreateSuccess = state => ({
    ...state,
    createInProgress: false,
    error: null,
})

const onCreateError = (state, { err }) => ({
    ...state,
    createInProgress: false,
    error: err,
})

const onRemoveStart = state => ({
    ...state,
    removeInProgress: true,
    error: null,
})

const onRemoveSuccess = state => ({
    ...state,
    removeInProgress: false,
    error: null,
})

const onRemoveError = (state, { err }) => ({
    ...state,
    removeInProgress: false,
    error: err,
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCH_START]: onListFetchStart,
    [Actions.Types.LIST_FETCH]: onListFetch,
    [Actions.Types.LIST_FETCH_SUCCESS]: onListFetchSuccess,
    [Actions.Types.LIST_FETCH_ERROR]: onListFetchError,
    [Actions.Types.CREATE_START]: onCreateStart,
    [Actions.Types.CREATE_SUCCESS]: onCreateSuccess,
    [Actions.Types.CREATE_ERROR]: onCreateError,
    [Actions.Types.REMOVE_START]: onRemoveStart,
    [Actions.Types.REMOVE_SUCCESS]: onRemoveSuccess,
    [Actions.Types.REMOVE_ERROR]: onRemoveError,
}

export default createReducer(INITIAL_STATE, HANDLERS)
