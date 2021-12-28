import { all, call, fork, select } from "redux-saga/effects"

import { getApprovedResourcesRequestById } from "../../api/client"
import { normalizeAndStore } from "../../entity-repository/entity-repository-saga"
import { approvedResourceRequest as approvedResourceRequestSchema } from "../../api/schema"
import { ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL } from "../../routing/routes"
import { onRouteEnter } from "../../routing/on-route-enter"
import { getProjectsHPCApprovedResourcesRequestId } from "../resources-requests-approved/resources-requests-selectors"
import { readApiSafely } from "../../api/api-saga"

function* onDetail() {
    const approvedResourceRequestId = yield select(
        getProjectsHPCApprovedResourcesRequestId
    )
    const approvedResourceRequestDetail = yield call(
        readApiSafely,
        getApprovedResourcesRequestById,
        approvedResourceRequestId
    )
    yield call(
        normalizeAndStore,
        approvedResourceRequestDetail,
        approvedResourceRequestSchema
    )
}

export function* approvedResourcesRequestsSaga() {
    yield all([
        fork(
            onRouteEnter,
            ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL,
            onDetail
        ),
    ])
}
