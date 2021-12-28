import { call, select, put } from "redux-saga/effects"
import { ToastsStore } from "react-toasts"
import { actions as routerActions } from "redux-router5"

import { readApiSafely } from "../../api/api-saga"
import { requestDatasetReplica } from "../../api/client"
import { ROUTE_DATA_SETS_LIST } from "../../routing/routes"
import { openNewTabWithReqStatus } from "../saga-submodules/data-sets-saga-queue"
import { UnauthorizedException } from "../../api/exceptions/unauthorized-exception"
import { stagePath } from "../data-sets-utils"
import { getDataSetsList } from "../../entity-repository/entity-repository-selectors"
import { getUserName } from "../../auth/auth-selectors"

export function* onRequestReplica({
    data
}) {
    try {
        const dataSets = yield select(getDataSetsList)
        const dataSet = dataSets[data.internalID]
        const { location } = dataSet
        const username = yield select(getUserName)
        const path = stagePath(location, username)

        const sourcePath = `${path}`
        const targetPath = `${path}`

        const { request_id } = yield call(
            readApiSafely,
            requestDatasetReplica,
            data.source_system,
            data.target_system,
            sourcePath,
            targetPath
        )

        yield put(routerActions.navigateTo(ROUTE_DATA_SETS_LIST, {}))
        openNewTabWithReqStatus(request_id, "replication")
    } catch (e) {
        switch (e.constructor) {
        case UnauthorizedException:
            yield ToastsStore.warning(
                "User not authorized to request dataset replica",
                12000
            )
            break

        default:
            throw e
        }
    }
}
