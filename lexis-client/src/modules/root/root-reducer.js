import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"

import ActionsAuth from "../auth/auth-actions"

import routing from "../routing/routing-reducer"
import organizations from "../organizations/organizations-reducer"
import entityRepository from "../entity-repository/entity-repository-reducer"
import { authReducer as auth } from "../auth/auth-reducer"
import users from "../users/users-reducer"
import datasets from "../data-sets/data-sets-reducer"
import projects from "../projects/projects-reducer"
import resources from "../projects/resources-requests-forms/resources-reducer"
import computerResources from "../projects/computer-resources/computer-resources-reducer"
import resourcesRequests from "../projects/resources-requests-dynamic/resources-requests-reducer"
import approvedResourcesRequests from "../projects/resources-requests-approved/resources-requests-reducer"
import hpcResources from "../projects/resources/list-hpc-resources-reducer"
import usageAccountInfo from "../projects/accounting-resources-requests/accounting-resources-requests-reducer"
import workflowTemplates from "../workflowTemplates/workflowTemplates-reducer"
import workflows from "../workflows/workflows-reducer"
import workflowExecutions from "../workflowExecutions/workflowExecutions-reducer"
import workflowExecutionLogs from "../workflowExecutions/workflowExecutions-reducer"
import workflowExecutionStepStatus from "../workflowExecutions/workflowExecutions-reducer"
import interactiveStyle from "../interactiveStyle/interactive-style-reducer"

const appReducer = combineReducers({
    auth,
    routing,
    organizations,
    projects,
    resources,
    computerResources,
    resourcesRequests,
    approvedResourcesRequests,
    hpcResources,
    usageAccountInfo,
    users,
    workflowTemplates,
    workflows,
    workflowExecutions,
    workflowExecutionLogs,
    workflowExecutionStepStatus,
    datasets,
    entityRepository,
    interactiveStyle,
    form: formReducer,
})

export const rootReducer = (state, action) => {
    if (action.type === ActionsAuth.Types.RESET_STATE) {
        state = undefined
    }

    return appReducer(state, action)
}
