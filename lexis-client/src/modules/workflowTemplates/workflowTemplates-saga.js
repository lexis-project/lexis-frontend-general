import { all, call, put, fork, select, takeEvery } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import Actions from "./workflowTemplates-actions"
import {
    listWorkflowTemplates,
    getWorkflowTemplates,
    uploadWorkflowTemplate,
} from "../api/client"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import {
    workflowTemplate as workflowTemplateSchema,
    workflowTemplates as workflowTemplatesSchema,
} from "../api/schema"
import {
    ROUTE_WORKFLOWTEMPLATES_LIST,
    ROUTE_WORKFLOW_CREATE,
    ROUTE_WORKFLOWS_LIST,
} from "../routing/routes"
import { onRouteEnter } from "../routing/on-route-enter"
import { getWorkflowTemplatesDetailId } from "./workflowTemplates-selectors"
import { NotFoundException } from "../api/exceptions/not-found-exception"
import { readApiSafely, createApiSafely } from "../api/api-saga"
import { ToastsStore } from "react-toasts"

function* onList() {
    try {
        yield put(Actions.Creators.listFetchStart())

        const workflowTemplates = yield call(
            readApiSafely,
            listWorkflowTemplates
        )

        if (workflowTemplates) {
            const workflowTemplateIds = yield call(
                normalizeAndStore,
                workflowTemplates,
                workflowTemplatesSchema
            )

            yield put(Actions.Creators.listFetch(workflowTemplateIds))

            yield put(Actions.Creators.listFetchSuccess())
        }
    } catch (err) {
        console.error("Error in saga for listing workflows - ", err)
        yield put(Actions.Creators.listFetchError(err))
    }
}

function* onDetail() {
    try {
        const workflowTemplateId = yield select(getWorkflowTemplatesDetailId)
        const workflowTemplate = yield call(
            readApiSafely,
            getWorkflowTemplates,
            workflowTemplateId
        )
        yield call(normalizeAndStore, workflowTemplate, workflowTemplateSchema)
    } catch (ex) {
        if (ex instanceof NotFoundException) {
            ToastsStore.warning("Requesting non-existing workflowTemplate")
            yield put(routerActions.navigateTo(ROUTE_WORKFLOWTEMPLATES_LIST))
        }
    }
}

function* onUpload(data) {
    try {
        yield put(Actions.Creators.uploadStart(true))
        yield call(
            createApiSafely,
            uploadWorkflowTemplate,
            data.data.workflowTemplate.file[0]
        )
        yield put(Actions.Creators.uploadSuccess(true))
        yield call(onList)
    } catch (err) {
        yield put(Actions.Creators.uploadError(true))
    }
}

export function* workflowTemplatesSaga() {
    yield all([
        fork(onRouteEnter, ROUTE_WORKFLOWTEMPLATES_LIST, onList),
        fork(onRouteEnter, ROUTE_WORKFLOW_CREATE, onDetail),
        takeEvery(Actions.Types.UPLOAD, onUpload),
    ])
}
