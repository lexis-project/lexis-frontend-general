import { all, call, put, fork } from "redux-saga/effects"

import Actions from "./computer-resources-actions"
import { normalizeAndStore } from "../../entity-repository/entity-repository-saga"
import { computerResources as computerResourcesSchema } from "../../api/schema"
import { ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC } from "../../routing/routes"
import { onRouteEnter } from "../../routing/on-route-enter"
import { readApiSafely } from "../../api/api-saga"
import { listDynamicResourcesSelection } from "../../api/client"

export function* onListDynamic() {
    const dynamicResources = yield call(
        readApiSafely,
        listDynamicResourcesSelection
    )
    const dynamicResourcesIds = yield call(
        normalizeAndStore,
        dynamicResources,
        computerResourcesSchema
    )
    yield put(Actions.Creators.listFetched(dynamicResourcesIds))
}

export function* computerResourcesSaga() {
    yield all([
        fork(onRouteEnter, ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC, onListDynamic),
    ])
}
