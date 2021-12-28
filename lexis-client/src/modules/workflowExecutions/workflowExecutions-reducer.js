import { createReducer } from "reduxsauce"

import Actions from "./workflowExecutions-actions"

const INITIAL_STATE = {
    wfe: null,
    list: [],
    logs: [],
    wfeStatus: [],
    batchErrors: [],
    batchStatus: {
        done: null,
    },
    fetchInProgress: false,
    fetchStatusInProgress: false,
    fetchLogsInProgress: false,
    deleteInProgress: false,
    additionalHeappeFields: null,
    error: null,
}

const onAdHpFlFetched = (state, { additionalHeappeFields }) => ({
    ...state,
    additionalHeappeFields,
    error: null,
})

const onWfeFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    error: null,
})

const onWfeFetch = (state, { workflowExecution }) => ({
    ...state,
    wfe: workflowExecution,
    fetchInProgress: true,
    error: null,
})

const onWfeFetchSuccess = state => ({
    ...state,
    fetchInProgress: false,
    error: null,
})

const onWfeFetchError = (state, { err }) => ({
    ...state,
    fetchInProgress: false,
    error: err,
})

const onStatusFetchStart = state => ({
    ...state,
    fetchStatusInProgress: true,
    error: null,
})

const onStatusFetch = (state, { workflowExecutionStepStatus }) => ({
    ...state,
    wfeStatus: workflowExecutionStepStatus,
    fetchStatusInProgress: true,
    error: null,
})

const onStatusFetchSuccess = state => ({
    ...state,
    fetchStatusInProgress: false,
    error: null,
})

const onStatusFetchError = (state, { err }) => ({
    ...state,
    fetchStatusInProgress: false,
    error: err,
})

const onListFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    error: null,
})

const onListFetch = (state, { workflowExecutionIds }) => ({
    ...state,
    list: workflowExecutionIds,
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

const onLogsFetchStart = state => ({
    ...state,
    fetchInProgress: true,
    error: null,
})

const onLogsFetch = (state, { workflowExecutionLogs }) => ({
    ...state,
    logs: workflowExecutionLogs,
    fetchInProgress: true,
    error: null,
})

const onLogsFetchSuccess = state => ({
    ...state,
    fetchInProgress: false,
    error: null,
})

const onLogsFetchError = (state, { err }) => ({
    ...state,
    fetchInProgress: false,
    error: err,
})

const onCreateStart = (state, { isInProgress }) => ({
    ...state,
    fetchInProgress: isInProgress,
    error: null,
})

const onCreateSuccess = (state, { isSuccessful }) => ({
    ...state,
    fetchInProgress: !isSuccessful,
    error: null,
})

const onCreateError = (state, { err }) => ({
    ...state,
    fetchInProgress: false,
    error: err,
})

const onDeleteStart = (state, { isInProgress }) => ({
    ...state,
    deleteInProgress: isInProgress,
    error: null,
})

const onDeleteSuccess = (state, { isSuccessful }) => ({
    ...state,
    deleteInProgress: false,
    error: null,
})

const onDeleteError = (state, { err }) => ({
    ...state,
    deleteInProgress: false,
    error: err,
})

const onBatchError = (state, { err }) => ({
    ...state,
    batchErrors: [...state.batchErrors, err],
})

const onBatchErrorReset = state => ({
    ...state,
    batchErrors: INITIAL_STATE.batchErrors,
})

const onBatchStatusChange = (state, { done }) => ({
    ...state,
    batchStatus: {
        done: done ? done : state.batchStatus.done,
    },
})

const onBatchStatusReset = state => ({
    ...state,
    batchStatus: INITIAL_STATE.batchStatus,
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCH_START]: onListFetchStart,
    [Actions.Types.LIST_FETCH]: onListFetch,
    [Actions.Types.LIST_FETCH_SUCCESS]: onListFetchSuccess,
    [Actions.Types.LIST_FETCH_ERROR]: onListFetchError,
    [Actions.Types.LOGS_FETCH_START]: onLogsFetchStart,
    [Actions.Types.LOGS_FETCH]: onLogsFetch,
    [Actions.Types.LOGS_FETCH_SUCCESS]: onLogsFetchSuccess,
    [Actions.Types.LOGS_FETCH_ERROR]: onLogsFetchError,
    [Actions.Types.WFE_FETCH_START]: onWfeFetchStart,
    [Actions.Types.WFE_FETCH]: onWfeFetch,
    [Actions.Types.WFE_FETCH_SUCCESS]: onWfeFetchSuccess,
    [Actions.Types.WFE_FETCH_ERROR]: onWfeFetchError,
    [Actions.Types.STATUS_FETCH_START]: onStatusFetchStart,
    [Actions.Types.STATUS_FETCH]: onStatusFetch,
    [Actions.Types.STATUS_FETCH_SUCCESS]: onStatusFetchSuccess,
    [Actions.Types.STATUS_FETCH_ERROR]: onStatusFetchError,
    [Actions.Types.CREATE_START]: onCreateStart,
    [Actions.Types.CREATE_SUCCESS]: onCreateSuccess,
    [Actions.Types.CREATE_ERROR]: onCreateError,
    [Actions.Types.DELETE_START]: onDeleteStart,
    [Actions.Types.DELETE_SUCCESS]: onDeleteSuccess,
    [Actions.Types.DELETE_ERROR]: onDeleteError,
    [Actions.Types.BATCH_ERROR]: onBatchError,
    [Actions.Types.BATCH_ERROR_RESET]: onBatchErrorReset,
    [Actions.Types.BATCH_STATUS_CHANGE]: onBatchStatusChange,
    [Actions.Types.BATCH_STATUS_RESET]: onBatchStatusReset,
    [Actions.Types.AD_HP_FL_FETCH]: onAdHpFlFetched,
}

export default createReducer(INITIAL_STATE, HANDLERS)
