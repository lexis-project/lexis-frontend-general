import { all, call, fork } from "redux-saga/effects"

import { authSaga } from "../auth/auth-saga"
import { organizationsSaga } from "../organizations/organizations-saga"
import { apiSaga } from "../api/api-saga"
import { userSaga } from "../user/user-saga"
import { usersSaga } from "../users/users-saga"
import { dataSetsSaga } from "../data-sets/data-sets-saga"
import { projectsSaga } from "../projects/projects-saga"
import { resourcesSaga } from "../projects/resources-requests-forms/resources-saga"
import { computerResourcesSaga } from "../projects/computer-resources/computer-resources-saga"
import { resourcesRequestsSaga } from "../projects/resources-requests-dynamic/resources-requests-saga"
import { approvedResourcesRequestsSaga } from "../projects/resources-requests-approved/resources-requests-saga"
import { usageAccountInfoSaga } from "../projects/accounting-resources-requests/accounting-resources-requests-saga"
import { workflowTemplatesSaga } from "../workflowTemplates/workflowTemplates-saga"
import { workflowsSaga } from "../workflows/workflows-saga"
import { workflowExecutionsSaga } from "../workflowExecutions/workflowExecutions-saga"

function* forkInSandbox(fn) {
    try {
        yield call(fn)
    } catch (err) {
        console.error(`Error occured in module ${fn.name} : ${err}`)
        yield fork(forkInSandbox, fn)
    }
}

export function* rootSaga() {
    yield all([
        fork(forkInSandbox, authSaga),
        fork(forkInSandbox, organizationsSaga),
        fork(forkInSandbox, projectsSaga),
        fork(forkInSandbox, apiSaga),
        fork(forkInSandbox, userSaga),
        fork(forkInSandbox, usersSaga),
        fork(forkInSandbox, dataSetsSaga),
        fork(forkInSandbox, resourcesSaga),
        fork(forkInSandbox, computerResourcesSaga),
        fork(forkInSandbox, resourcesRequestsSaga),
        fork(forkInSandbox, approvedResourcesRequestsSaga),
        fork(forkInSandbox, usageAccountInfoSaga),
        fork(forkInSandbox, workflowTemplatesSaga),
        fork(forkInSandbox, workflowsSaga),
        fork(forkInSandbox, workflowExecutionsSaga),
    ])
}
