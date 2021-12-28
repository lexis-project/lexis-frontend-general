import {
    all,
    call,
    takeEvery,
    put,
    fork,
    select,
    delay,
} from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"
import { ToastsStore } from "react-toasts"

import Actions from "./users-actions"
import authActions from "./../auth/auth-actions"
import apiActions from "./../api/api-actions"
import {
    createUsers,
    listUsers,
    updateUsers,
    deleteUsers,
    getUser,
    addRoleToUser,
} from "../api/client"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import { user as userSchema, users as usersSchema } from "../api/schema"
import {
    ROUTE_USERS_LIST,
    ROUTE_USERS_DETAIL,
    ROUTE_USERS_EDIT,
} from "../routing/routes"
import { onRouteEnter } from "../routing/on-route-enter"
import { getUsersDetailId } from "./users-selectors"
import {
    readApiSafely,
    createApiSafely,
    updateApiSafely,
    deleteApiSafely,
} from "../api/api-saga"
import { getOrganizationId } from "../user/user-selectors"

function* onUsernameToState({ usr }) {
    try {
        // TODO FIXME
        // yield put(authActions.Creators.usernameToState(usr))
        // yield delay(1000)

        // TODO FIXME utilize to the max "take" effect and its capabilities to build complex control flow vs. silly takeEvery, takeLatest etc
        take(delay(1000), put(authActions.Creators.usernameToState(usr)))
    } catch (err) {
        console.error("Error in saga for putting username to state - ", err)
        const usernameCreationFailed = true

        yield put(authActions.Creators.usernameError(usernameCreationFailed))
    }
}

function* onCreatingUserNameError({ err }) {
    const usernameCreationFailed = yield put(
        authActions.Creators.usernameError(err)
    )

    try {
        if (usernameCreationFailed) {
            yield put(
                apiActions.Creators.warningException(
                    "Was username creation OK? " + err
                )
            )
        }
    } catch (e) {
        console.error("Error in saga which creates unique username - ", e)
    }
}

function* onCreate({ data }) {
    yield delay(500) // wait for redux-form actions flooding
    yield call(onList)

    if(!data.OrganizationID)
    {
        data.OrganizationID = yield select(getOrganizationId)
    }

    let username = ""
    let lastNameVal = data.FirstName
    let firstNameVal = data.LastName

    if (data && (data.FirstName !== undefined || data.LastName !== undefined)) {
        lastNameVal = data && data.LastName.substring(0, 2)
        firstNameVal = data && data.FirstName
    }

    username = firstNameVal + "" + lastNameVal
    username = username === undefined ? null : username.toLocaleLowerCase()

    yield delay(500) // try to wait until the change is done by API
    yield call(createApiSafely, createUsers, {
        ...data,
        Username: username,
    })

    yield put(routerActions.navigateTo(ROUTE_USERS_LIST))
    yield delay(1500) // try to wait until the change is done by API
    yield call(onList)

}

export function* onList() {
    try {
        yield put(Actions.Creators.listFetchStart())

        const users = yield call(readApiSafely, listUsers, null, true)
        const usersIds = yield call(normalizeAndStore, users, usersSchema)
        yield put(Actions.Creators.listFetched(usersIds))

        yield put(Actions.Creators.listFetchSuccess())
    } catch (err) {
        console.error("Error in saga for fetching list of users - ", err)

        yield put(Actions.Creators.listFetchError(err))
    }
}

// TODO FIXME in next issues - users are fetching too often; there must be saga debounce or throttle; below just experiment

/*
export function* throttleUsersLoading({ ids }) {
    let dateStart = Date.now()
    ToastsStore.success(`dateStart:::${dateStart}`, 4000)
    // let delayed = yield delay(10000)
    let debouncedOnChange = debounce(editUsers, 1000);
    console.log('delayed:::', ids)
    // yield put(Actions.Creators.listFetched(ids))
    yield fork()

    ToastsStore.success(`Date.now() - dateStart:::${Date.now() - dateStart}`, 4000)
}
*/

function* onUpdate({ data }) {
    const id = yield select(getUsersDetailId)
    yield call(updateApiSafely, updateUsers, id, data)
    yield put(routerActions.navigateTo(ROUTE_USERS_LIST))
}

function* onRemove({ id }) {
    try {
        yield call(deleteApiSafely, deleteUsers, id)
        yield put(routerActions.navigateTo(ROUTE_USERS_LIST))
    } catch (e) {
        console.error(e)
        ToastsStore.error("Error while removing user occured!", 6000)
    }
}

function* onDetail() {
    const id = yield select(getUsersDetailId)
    const user = yield call(readApiSafely, getUser, id)
    yield call(normalizeAndStore, user, userSchema)
}

function* onSetRole({ userID, role, orgID, prjID, prjShortName }) {
    try {
        yield call(
            readApiSafely,
            addRoleToUser,
            userID,
            orgID,
            prjID,
            prjShortName,
            role
        )
        ToastsStore.success("Role set successfully")
        yield put(Actions.Creators.setRoleDone())
    } catch (e) {
        console.error(e)
        ToastsStore.error("Error occures while setting user role")
        yield put(Actions.Creators.setRoleDone())
    }
}

export function* usersSaga() {
    yield all([
        takeEvery(Actions.Types.CREATE, onCreate),
        takeEvery(authActions.Types.USERNAME_TO_STATE, onUsernameToState), // TODO FIXME they stopped working :(
        takeEvery(authActions.Types.USERNAME_ERROR, onCreatingUserNameError), // TODO FIXME they stopped working :(
        // TODO FIXME viz line 56 takeEvery("@@redux-form/UPDATE_SYNC_ERRORS", catchFormErrors),
        takeEvery(Actions.Types.UPDATE, onUpdate),
        takeEvery(Actions.Types.REMOVE, onRemove),
        takeEvery(Actions.Types.SET_ROLE, onSetRole),
        // TODO FIXME viz line 56 takeEvery(Actions.Types.LIST_FETCHED, throttleUsersLoading),
        fork(onRouteEnter, ROUTE_USERS_LIST, onList),
        fork(onRouteEnter, ROUTE_USERS_EDIT, onDetail),
        fork(onRouteEnter, ROUTE_USERS_DETAIL, onDetail),
    ])
}
