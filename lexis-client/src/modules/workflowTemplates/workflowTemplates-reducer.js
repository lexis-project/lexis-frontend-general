import { createReducer } from "reduxsauce"

import Actions from "./workflowTemplates-actions"

const INITIAL_STATE = {
    list: [],
    fetchInProgress: false,
    uploadInProgress: false,
    error: null,
}

const onListFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    error: null,
})

const onListFetch = (state, { workflowTemplateIds }) => ({
    ...state,
    list: workflowTemplateIds,
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

const onUploadStart = (state, { isInProgress }) => ({
    ...state,
    uploadInProgress: isInProgress,
    error: null,
})

const onUploadSuccess = (state, { isSuccessful }) => ({
    ...state,
    uploadInProgress: false,
    error: null,
})

const onUploadError = (state, { err }) => ({
    ...state,
    uploadInProgress: false,
    error: err,
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCH_START]: onListFetchStart,
    [Actions.Types.LIST_FETCH]: onListFetch,
    [Actions.Types.LIST_FETCH_SUCCESS]: onListFetchSuccess,
    [Actions.Types.LIST_FETCH_ERROR]: onListFetchError,
    [Actions.Types.UPLOAD_START]: onUploadStart,
    [Actions.Types.UPLOAD_SUCCESS]: onUploadSuccess,
    [Actions.Types.UPLOAD_ERROR]: onUploadError,
}

export default createReducer(INITIAL_STATE, HANDLERS)
