import { createSelector } from "reselect"
import {
    getWorkflowExecutions as getState,
    getWorkflowExecutionLogs as getWELState,
    getWorkflowExecutionStepStatus as getWESState,
} from "../root/root-selectors"
import { getWorkflowExecutions as getWorkflowExecutionsER } from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"

export const getFetchingStateOfWorkflowExecution = createSelector(
    getState,
    state => state.fetchInProgress
)

export const getFetchingStateOfWorkflowExecutions = createSelector(
    getState,
    state => state.fetchInProgress
)

export const getFetchingStateOfWorkflowExecutionStepStatuses = createSelector(
    getState,
    state => state.fetchStatusInProgress
)

export const getFetchingStateOfWorkflowExecutionLogs = createSelector(
    getState,
    state => state.fetchLogsInProgress
)

export const getCreatingState = createSelector(
    getState,
    state => state.fetchInProgress
)

export const getDeletingState = createSelector(
    getState,
    state => state.deleteInProgress
)

export const getBatchErrors = createSelector(
    getState,
    state => state.batchErrors
)

export const getBatchStatus = createSelector(
    getState,
    state => state.batchStatus
)

export const getWorkflowExecutions = createSelector(
    getState,
    getWorkflowExecutionsER,
    (state, entityRepo) =>
        state.list.map(workflowExecutionId => entityRepo[workflowExecutionId])
)

export const getWorkflowExecutionLogs = createSelector(
    getWELState,
    state => state["logs"]
)

export const getWorkflowExecutionStepStatus = createSelector(
    getWESState,
    state => state["wfeStatus"]
)

export const getWorkflowExecutionDetailId = createSelector(
    getRouteParams,
    routeParams => routeParams.workflowExecutionId
)

export const getWorkflowExecutionDetail = createSelector(
    getWorkflowExecutionsER,
    getWorkflowExecutionDetailId,
    (entityRepo, workflowExecutionId) => entityRepo[workflowExecutionId]
)

export const getWorkflowExecutionRoutedParameters = createSelector(
    getRouteParams,
    routeParams => routeParams.routedParameters
)

export const getAdditionalHeappeFields = createSelector(
    getState,
    state => state.additionalHeappeFields
)
