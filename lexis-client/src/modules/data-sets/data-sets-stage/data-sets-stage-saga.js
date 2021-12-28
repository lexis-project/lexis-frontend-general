import { call, put, select } from "redux-saga/effects"
import { ToastsStore } from "react-toasts"
import { actions as routerActions } from "redux-router5"

import { readApiSafely } from "../../api/api-saga"
import { stageDataset } from "../../api/client"
import { ROUTE_DATA_SETS_LIST } from "../../routing/routes"
import { UnauthorizedException } from "../../api/exceptions/unauthorized-exception"
import { openNewTabWithReqStatus } from "../saga-submodules/data-sets-saga-queue"
import { getUpdatedMetadata } from "../data-sets-selectors"
import { getDataSetsList } from "../../entity-repository/entity-repository-selectors"
import { stagePath, waitForDatasetLoaded } from "../data-sets-utils"
import { getUserName } from "../../auth/auth-selectors"

export function* onRequestStage({
    internalID,
    source_system,
    target_system,
    datPath
}) {
    try {
        const datasetLoaded = yield call(waitForDatasetLoaded, [internalID])
        if(datasetLoaded) {
            const dataSets = yield select(getDataSetsList)
            const dataSet = dataSets[internalID]
            const {location, flags} = dataSet
            const username = yield select(getUserName)
            const path = stagePath(location, username)
            const sourcePath = `/${source_system}/${path}${datPath ? datPath:""}`
            const targetPath = `/${target_system}/${path}${datPath ? datPath:""}`

            const updatedMetadata = yield select(getUpdatedMetadata)

            const { request_id } = yield call(
                readApiSafely,
                stageDataset,
                source_system,
                target_system,
                sourcePath,
                targetPath,
                flags && flags.encryption ? 'yes' : 'no',
                flags && flags.compression ? 'yes' : 'no',
                updatedMetadata
            )
            yield put(routerActions.navigateTo(ROUTE_DATA_SETS_LIST, {}))
            openNewTabWithReqStatus(request_id,'staging')
        }
    } catch(e){
        switch (e.constructor) {
        case UnauthorizedException:
            yield ToastsStore.warning("User not authorized to request PID", 12000)
            break
        
        default:
            throw e
        }
    }
}