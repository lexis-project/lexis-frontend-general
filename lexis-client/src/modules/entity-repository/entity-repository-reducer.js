import mergeWith from "lodash/mergeWith"
import isArray from "lodash/isArray"
import { createReducer } from "reduxsauce"

import Actions from "./entity-repository-actions"

const INITIAL_STATE = {
    organizations: {},
    projects: {},
    computerResources: {},
    resourceRequests: {},
    approvedResourceRequests: {},
    hpcResources: {},
    usage: {},
    users: {},
    datasetsList: {},
    datasetsFilelist: {},
    datasetsZip: {},
    datasetsZipError: {},
    datasetStatusList: {},
    datasetQuery: "{}",
    datasetMulti: {},
    datasetStageDownload: {},
    temp: {},
    workflowTemplates: {},
    workflows: {},
    workflowExecutions: {},
    workflowExecutionLogs: {},
    workflowExecutionStepStatus: {},
}

const repositoryHasChanged = (state, { repository }) =>
    mergeWith({}, state, repository, (objValue, srcValue) => {
        if (isArray(objValue) && isArray(srcValue)) {
            return srcValue
        }

        return undefined
    })

export const HANDLERS = {
    [Actions.Types.REPOSITORY_HAS_CHANGED]: repositoryHasChanged,
}

export default createReducer(INITIAL_STATE, HANDLERS)
