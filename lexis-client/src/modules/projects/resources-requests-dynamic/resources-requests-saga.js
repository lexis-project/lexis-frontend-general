import { all, call, fork, select } from "redux-saga/effects"

import { getResourcesRequestById } from "../../api/client"
import { normalizeAndStore } from "../../entity-repository/entity-repository-saga"
import { resourceRequest as resourceRequestSchema } from "../../api/schema"
import { ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL } from "../../routing/routes"
import { onRouteEnter } from "../../routing/on-route-enter"
import { getProjectsHPCResourcesRequestId } from "../resources-requests-dynamic/resources-requests-selectors"
import { readApiSafely } from "../../api/api-saga"

function* onDetail() {
    const resourceRequestId = yield select(getProjectsHPCResourcesRequestId)
    const resourceRequestDetail = yield call(
        readApiSafely,
        getResourcesRequestById,
        resourceRequestId
    )
    yield call(normalizeAndStore, resourceRequestDetail, resourceRequestSchema)
}

export function* resourcesRequestsSaga() {
    yield all([
        fork(onRouteEnter, ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL, onDetail),
    ])
}
