import { all, call, put, select, fork } from "redux-saga/effects"

import ActionsUsageAccounting from "./accounting-resources-requests-actions"
import { getProjectAccountingData } from "../../api/client"
import { normalizeAndStore } from "../../entity-repository/entity-repository-saga"
import { usage as usageSchema } from "../../api/schema"
import { ROUTE_PROJECT_DETAIL } from "../../routing/routes"
import { onRouteEnter } from "../../routing/on-route-enter"
import { getProjectId, getProjectStartDate } from "../projects-selectors"
import { readApiSafely } from "../../api/api-saga"

function* onFetchUsageInfo() {
    const prjStartDate = yield select(getProjectStartDate)
    const lexisProjectId = yield select(getProjectId)
        
    try {
        if (prjStartDate) {
            const lexisProjectStartDate = new Date(prjStartDate).toISOString()
            const currentDate = new Date().toISOString()

            const usageAccountingInfo = yield call(readApiSafely, getProjectAccountingData, lexisProjectId, lexisProjectStartDate, currentDate)
            const usageAccountingInfoId = yield call(normalizeAndStore, usageAccountingInfo, usageSchema)
            yield put(ActionsUsageAccounting.Creators.fetched(usageAccountingInfoId))
        }
    } catch (err) {
        console.error("Error in saga for fetching usage data for specific project - ", err)
    
    }
}

export function* usageAccountInfoSaga() {
    yield all([fork(onRouteEnter, ROUTE_PROJECT_DETAIL, onFetchUsageInfo)])
}
