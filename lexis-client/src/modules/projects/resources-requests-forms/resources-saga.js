import { all, call, takeEvery, put, select } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import Actions from "./resources-actions"
import {
    createHPCResource,
    createHPCApprovedResourceRequest,
} from "../../api/client"
import { ROUTE_PROJECT_DETAIL } from "../../routing/routes"
import { getResourcesProjectId } from "./resources-selectors"
import { createApiSafely } from "../../api/api-saga"
import { getComputerResources } from "../computer-resources/computer-resources-selectors"
import { getProjectDetail } from "../projects-selectors"

function* onCreate({ data }) {
    const projectId = yield select(getResourcesProjectId)
    const projectDetail = yield select(getProjectDetail)

    data.LEXISProjectID = projectId
    data.ApprovalStatus = "PENDING"
    data.ApprovalObjections = ""
    data.CoreHoursExpected = parseInt(data.CoreHoursExpected)
    data.Budget = parseInt(data.Budget)
    data.ProjectContactEmail = projectDetail.ProjectContactEmail
    data.LEXISProjectName = projectDetail.ProjectName

    const compResources = yield select(getComputerResources)
    let queueListConcat = compResources.reduce(
        (acc, currentVal) => acc.concat(currentVal.QueueList),
        []
    )
    let resourceRequest = []
    data.Resources.forEach(item => {
        if (typeof item === "string") {
            resourceRequest.push({
                QueueId: parseInt(item),
                QueueName: queueListConcat.find(el => el.Id === parseInt(item))
                    .Name,
                ClusterId: compResources
                    .map(function (compRes) {
                        if (
                            compRes.QueueList.find(
                                el => el.Id === parseInt(item)
                            )
                        ) {
                            return compRes.Id
                        } else {
                            return null
                        }
                    })
                    .filter(el => el !== null)[0],
                ClusterName: compResources
                    .map(function (compRes) {
                        if (
                            compRes.QueueList.find(
                                el => el.Id === parseInt(item)
                            )
                        ) {
                            return compRes.Name
                        } else {
                            return null
                        }
                    })
                    .filter(el => el !== null)[0],
            })
        }
    })

    data.Resources = resourceRequest

    delete data.HPCProvider

    yield call(createApiSafely, createHPCResource, data)
    yield put(routerActions.navigateTo(ROUTE_PROJECT_DETAIL, { id: projectId }))
}

function* onCreateApproved({ data }) {
    const projectId = yield select(getResourcesProjectId)
    const projectDetail = yield select(getProjectDetail)

    data.AssociatedLEXISProject = projectId
    data.AssociatedLEXISProjectName = projectDetail.ProjectName
    // FIXME data.ProjectContactEmail = projectDetail.ProjectContactEmail
    data.ApprovalStatus = "PENDING"
    data.ApprovalObjections = ""

    yield call(createApiSafely, createHPCApprovedResourceRequest, data)
    yield put(routerActions.navigateTo(ROUTE_PROJECT_DETAIL, { id: projectId }))
}

export function* resourcesSaga() {
    yield all([
        takeEvery(Actions.Types.CREATE, onCreate),
        takeEvery(Actions.Types.CREATE_APPROVED, onCreateApproved),
    ])
}
