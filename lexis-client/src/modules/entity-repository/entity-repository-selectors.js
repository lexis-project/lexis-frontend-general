import { createSelector } from "reselect"
import { getEntityRepository as getState } from "../root/root-selectors"

export const getOrganizations = createSelector(
    getState,
    state => state.organizations
)

export const getUsers = createSelector(getState, state => state.users)

export const getDataSetsList = createSelector(
    getState,
    state => state.datasetsList
)

export const getDataSetsFilelist = createSelector(
    getState,
    state => state.datasetsFilelist
)

export const getDataSetsZip = createSelector(
    getState,
    state => state.datasetsZip
)

export const getDataSetQuery = createSelector(
    getState,
    state => state.datasetQuery
)

export const getDataSetStatusList = createSelector(
    getState,
    state => Object.values(state.datasetStatusList)[0]
)

export const getDatasetMulti = createSelector(
    getState,
    state => state && state.datasetDownloadMulti
)

export const getStageDownload = createSelector(
    getState,
    state => state.datasetStageDownload
)

export const getDsSize = createSelector(getState, state => state.dsSize)

export const getTempData = createSelector(getState, state => state.temp)

export const getProjects = createSelector(getState, state => state.projects)

export const getUsage = createSelector(getState, state => state.usage)

export const getResources = createSelector(getState, state => state.resources)

export const getProjectUsers = createSelector(
    getState,
    state => state.projectUsers
);

export const getComputerResources = createSelector(
    getState,
    state => state.computerResources
)

export const getResourcesRequests = createSelector(
    getState,
    state => state.resourcesRequests
)

export const getApprovedResourceRequests = createSelector(
    getState,
    state => state.approvedResourceRequests
)

export const getHpcResources = createSelector(
    getState,
    state => state.hpcResources
)

export const getWorkflowTemplates = createSelector(
    getState,
    state => state.workflowTemplates
)

export const getWorkflows = createSelector(getState, state => state.workflows)

export const getWorkflowExecutions = createSelector(
    getState,
    state => state.workflowExecutions
)

export const getWorkflowExecutionLogs = createSelector(
    getState,
    state => state.workflowExecutionLogs
)

export const getWorkflowExecutionStatus = createSelector(
    getState,
    state => state.workflowExecutionStepStatus
)
