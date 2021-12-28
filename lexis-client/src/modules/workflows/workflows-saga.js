import { all, call, takeEvery, put, fork, select } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import ActionsWorkflows from "./workflows-actions"
import {
    listWorkflows,
    getWorkflows,
    createWorkflow,
    deleteWorkflow,
    getUser,
} from "../api/client"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import {
    workflow as workflowSchema,
    workflows as workflowsSchema,
    user as userSchema
} from "../api/schema"
import { ROUTE_WORKFLOWS_LIST, ROUTE_WORKFLOWS_DETAIL } from "../routing/routes"
import { onRouteEnter } from "../routing/on-route-enter"
import { getWorkflowsDetailId } from "./workflows-selectors"
import { NotFoundException } from "../api/exceptions/not-found-exception"
import {
    readApiSafely,
    createApiSafely,
    deleteApiSafely,
} from "../api/api-saga"
import { ToastsStore } from "react-toasts"

function* onList() {
    try {
        yield put(ActionsWorkflows.Creators.listFetchStart())

        const workflows = yield call(readApiSafely, listWorkflows)

        if (workflows) {
            const workflowIds = yield call(
                normalizeAndStore,
                workflows,
                workflowsSchema
            )

            yield put(ActionsWorkflows.Creators.listFetch(workflowIds))

            yield put(ActionsWorkflows.Creators.listFetchSuccess())
        }
    } catch (err) {
        console.error("Error in saga for listing workflows - ", err)
        yield put(ActionsWorkflows.Creators.listFetchError(err))
    }
}

export function* onDetail() {
    try {
        const workflowId = yield select(getWorkflowsDetailId)
        const workflow = yield call(readApiSafely, getWorkflows, workflowId)
        yield call(normalizeAndStore, workflow, workflowSchema)

        const createdBy = workflow.createdBy
        if(createdBy)
        {
            try {
                const user = yield call(getUser, createdBy)
                yield call(normalizeAndStore, user.data, userSchema)
            }catch(err){
                console.warn("Unable to load detail of user:", createdBy)
            }
        }
        
    } catch (ex) {
        if (ex instanceof NotFoundException) {
            ToastsStore.warning("Requesting non-existing workflow")
            yield put(routerActions.navigateTo(ROUTE_WORKFLOWS_LIST))
        }
    }
}

function* onCreate({ data }) {
    try {
        yield put(ActionsWorkflows.Creators.createStart())

        yield call(createApiSafely, createWorkflow, data)
        yield put(ActionsWorkflows.Creators.createSuccess())
    } catch (err) {
        console.error("Error in saga for creating workflow - ", err)
        yield put(ActionsWorkflows.Creators.createError(err))
    }
    yield put(routerActions.navigateTo(ROUTE_WORKFLOWS_LIST))
}

function* onRemove() {
    if (window.confirm("Are you sure?")) {
        try {
            yield put(ActionsWorkflows.Creators.removeStart())
            const workflowId = yield select(getWorkflowsDetailId)
            yield call(deleteApiSafely, deleteWorkflow, workflowId)
            yield put(ActionsWorkflows.Creators.removeSuccess())
        } catch (err) {
            console.error("Error in saga for deleting workflow - ", err)
            yield put(ActionsWorkflows.Creators.removeError(err))
        }
        yield put(routerActions.navigateTo(ROUTE_WORKFLOWS_LIST))
    }
}

export function* workflowsSaga() {
    yield all([
        takeEvery(ActionsWorkflows.Types.CREATE, onCreate),
        takeEvery(ActionsWorkflows.Types.REMOVE, onRemove),
        fork(onRouteEnter, ROUTE_WORKFLOWS_LIST, onList),
        fork(onRouteEnter, ROUTE_WORKFLOWS_DETAIL, onDetail),
    ])
}
