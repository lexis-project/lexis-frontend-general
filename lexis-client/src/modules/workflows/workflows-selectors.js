import { createSelector } from "reselect"
import { getWorkflows as getState } from "../root/root-selectors"
import { getWorkflows as getWorkflowsER } from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"

export const getFetchingStateOfWorkflows = createSelector(
    getState,
    state => state.fetchInProgress
)

export const getCreatingState = createSelector(
    getState,
    state => state.createInProgress
)

export const getRemovingState = createSelector(
    getState,
    state => state.removeInProgress
)

export const getWorkflows = createSelector(
    getState,
    getWorkflowsER,
    (state, entityRepo) => state.list.map(workflowId => entityRepo[workflowId])
)

export const getWorkflowsDetailId = createSelector(
    getRouteParams,
    routeParams => routeParams.workflowId
)

export const getWorkflowsDetail = createSelector(
    getWorkflowsER,
    getWorkflowsDetailId,
    (entityRepo, workflowId) => entityRepo[workflowId]
)

export const getWFDetailInputParameters = createSelector(
    getWorkflowsDetail,
    wf => {
        return (
            wf &&
            wf.inputParameters &&
            wf.inputParameters.map(item => Object.keys(item))
        )
    }
)

export const isWFTasksThere = createSelector(
    getWFDetailInputParameters,
    inputParameters => {
        return inputParameters && inputParameters.flat().includes("task")
    }
)
export const getWFDetailInputParameterValues = createSelector(
    getWorkflowsDetail,
    wf => {
        return (
            wf &&
            wf.inputParameters &&
            wf.inputParameters.map(item => Object.values(item))
        )
    }
)

export const isPreprocessingTasksThere = createSelector(
    getWFDetailInputParameterValues,
    inputParameters => {
        return (
            inputParameters && inputParameters.flat().includes("preprocessing")
        )
    }
)

export const isComputationTasksThere = createSelector(
    getWFDetailInputParameterValues,
    inputParameters => {
        return inputParameters && inputParameters.flat().includes("computation")
    }
)

export const isPostprocessingTasksThere = createSelector(
    getWFDetailInputParameterValues,
    inputParameters => {
        return (
            inputParameters && inputParameters.flat().includes("postprocessing")
        )
    }
)

export const isVisualizationTasksThere = createSelector(
    getWFDetailInputParameterValues,
    inputParameters => {
        return (
            inputParameters && inputParameters.flat().includes("visualization")
        )
    }
)
