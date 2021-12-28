import { createSelector } from "reselect"
import { getWorkflowTemplates as getState } from "../root/root-selectors"
import { getWorkflowTemplates as getWorkflowTemplatesER } from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"

export const getFetchingState = createSelector(
    getState,
    state => state.fetchInProgress
)

export const getUploadingState = createSelector(
    getState,
    state => state.uploadInProgress
)

export const getWorkflowTemplates = createSelector(
    getState,
    getWorkflowTemplatesER,
    (state, entityRepo) =>
        state.list.map(workflowTemplateId => entityRepo[workflowTemplateId])
)

export const getWorkflowTemplatesDetailId = createSelector(
    getRouteParams,
    routeParams => routeParams && routeParams.workflowTemplateId
)

export const getWorkflowTemplatesDetail = createSelector(
    getWorkflowTemplatesER,
    getWorkflowTemplatesDetailId,
    (entityRepo, workflowTemplateId) =>
        workflowTemplateId && entityRepo[workflowTemplateId]
)

export const getWFtemplatesDetailInputParameters = createSelector(
    getWorkflowTemplatesDetail,
    wfTemplate => {
        return (
            wfTemplate &&
            wfTemplate.inputParameters &&
            wfTemplate.inputParameters.map(item => Object.keys(item))
        )
    }
)

export const isWFtemplateTasksThere = createSelector(
    getWFtemplatesDetailInputParameters,
    inputParameters => {
        return inputParameters && inputParameters.flat().includes("task")
    }
)
export const getWFtemplatesDetailInputParameterValues = createSelector(
    getWorkflowTemplatesDetail,
    wfTemplate => {
        return (
            wfTemplate &&
            wfTemplate.inputParameters &&
            wfTemplate.inputParameters.map(item => Object.values(item))
        )
    }
)

export const isPreprocessingTasksThere = createSelector(
    getWFtemplatesDetailInputParameterValues,
    inputParameters => {
        return (
            inputParameters && inputParameters.flat().includes("preprocessing")
        )
    }
)

export const isComputationTasksThere = createSelector(
    getWFtemplatesDetailInputParameterValues,
    inputParameters => {
        return inputParameters && inputParameters.flat().includes("computation")
    }
)

export const isPostprocessingTasksThere = createSelector(
    getWFtemplatesDetailInputParameterValues,
    inputParameters => {
        return (
            inputParameters && inputParameters.flat().includes("postprocessing")
        )
    }
)

export const isVisualizationTasksThere = createSelector(
    getWFtemplatesDetailInputParameterValues,
    inputParameters => {
        return (
            inputParameters && inputParameters.flat().includes("visualization")
        )
    }
)
