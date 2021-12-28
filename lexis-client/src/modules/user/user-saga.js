import { takeEvery, all, call, put, select, fork } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import { ROUTE_USER_PROFILE } from "../routing/routes"
import { getUser, updateUsers } from "../api/client"
import { readApiSafely, updateApiSafely } from "../api/api-saga"
import { getUserProfileID } from "./user-selectors"
import Actions from "./user-actions"
import ActionsAuth from "../auth/auth-actions"
import { onList as refreshUsersList } from "../users/users-saga"
import { getLoggedInUsersDetail } from "../users/users-selectors"
import { onRouteEnter } from "../routing/on-route-enter"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import { user as userSchema } from '../api/schema'

function* onUpdate({ data }) {
    const ID = yield select(getUserProfileID)
    yield call(updateApiSafely, updateUsers, ID, data)

    yield call(refreshUsersList)
    const loggedInUser = yield select(getLoggedInUsersDetail)
    yield put(
        ActionsAuth.Creators.userProfileEdited(
            loggedInUser.FirstName,
            loggedInUser.LastName,
            loggedInUser.EmailAddress
        )
    )
    yield put(routerActions.navigateTo(ROUTE_USER_PROFILE))
}

export function* getLoggedUserDetails(userID) {
    if (!userID) {
        const loggedInUser = yield select(getLoggedInUsersDetail)
        if (loggedInUser === undefined) {
            throw new Error('Undefined logged in user object with information')
        }
        if (loggedInUser.id === undefined) {
            throw new Error('Undefined property id in user info object')
        }
        userID = loggedInUser.id
    }
    const user = yield call(readApiSafely, getUser, userID)
    yield call(normalizeAndStore, user, userSchema)
    return user
}

function* onUserProfileDetail() {
    yield call(refreshUsersList)
}

export function* userSaga() {
    yield all([
        takeEvery(Actions.Types.UPDATE, onUpdate),
        fork(onRouteEnter, ROUTE_USER_PROFILE, onUserProfileDetail),
    ])
}
