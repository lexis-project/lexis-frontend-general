import { all, call, takeEvery, put, fork, select } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import Actions from "./organizations-actions"
import ActionsAuthUserProfile from "../auth/auth-actions"
import {
    createOrganization,
    listOrganizations,
    updateOrganization,
    getOrganization,
    updateUsers,
    getUser,
} from "../api/client"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import { organization as organizationSchema, organizations as organizationsSchema } from "../api/schema"
import {
    ROUTE_ORGANIZATIONS_EDIT,
    ROUTE_ORGANIZATION,
    ROUTE_ORGANIZATION_ASSIGN,
    ROUTE_ORGANIZATION_DETAIL,
    ROUTE_ERROR,
} from "../routing/routes"
import { onRouteEnter } from "../routing/on-route-enter"
import { getOrganizatonDetailId } from "./organizations-selectors"
import {
    readApiSafely,
    createApiSafely,
    updateApiSafely,
} from "../api/api-saga"
import { getSessionId, getUserRole } from "../auth/auth-selectors"
import authCheckPerms from "../auth/auth-check-perms"
import { getOrganizationId } from "../user/user-selectors"
import usersActions from "../users/users-actions"
import { getOrganizations } from "../entity-repository/entity-repository-selectors"
import {initUserProfile} from "../auth/auth-saga"

function* onCreate({ data }) {
    data["CreatedBy"] = yield select(getSessionId)
    yield call(createApiSafely, createOrganization, data)

    // find ID of Organization by user who just created it
    const organizations = yield call(readApiSafely, listOrganizations)
    const organizationId = organizations
        .reverse()
        .find(org => org.CreatedBy === data.CreatedBy).ID

    // update user
    let user = yield call(readApiSafely, getUser, data.CreatedBy)
    user.OrganizationID = organizationId
    yield call(updateApiSafely, updateUsers, data.CreatedBy, user)

    yield put(routerActions.navigateTo(ROUTE_ORGANIZATION))
    yield call(initUserProfile)
}

function* onOrganization() {
    // check if logged user is assigned to organization (its OrganizationID)
    const loggedUserId = yield select(getSessionId)
    const user = yield call(readApiSafely, getUser, loggedUserId)

    if (!user.OrganizationID) {
        const userRole = yield select(getUserRole)
        const perms = authCheckPerms({
            permissionName: "update-organization",
            userRole,
        })
        if (perms) {
            yield put(routerActions.navigateTo(ROUTE_ORGANIZATION_ASSIGN))
        } else {
            yield put(
                routerActions.navigateTo(ROUTE_ERROR, {
                    eType: "404",
                    eMessage: "Unassigned organization",
                })
            )
        }
    } else {
        const organizationId = user.OrganizationID
        const organization = yield call(
            readApiSafely,
            getOrganization,
            organizationId
        )
        yield call(normalizeAndStore, organization, organizationSchema)
        yield put(
            ActionsAuthUserProfile.Creators.userProfileOrganizationAdded(
                organizationId,
                organization.FormalName
            )
        )
        yield put(
            routerActions.navigateTo(ROUTE_ORGANIZATION_DETAIL, {
                Id: organizationId,
            })
        )
    }
}

export function* loadUserOrganization(organizationId){
    if(organizationId)
    {
        const organization = yield call(
            readApiSafely,
            getOrganization,
            organizationId
        )
        yield call(normalizeAndStore, organization, organizationSchema)
        yield put(
            ActionsAuthUserProfile.Creators.userProfileOrganizationAdded(
                organizationId,
                organization.FormalName
            )
        )
    }
}

export function* loadUserOrganizations(userDetail){
    if(userDetail.OrganizationID)
    {    
        const orgIDs = userDetail.AllowedOrganizations

        let organizations = yield call(
            readApiSafely,
            listOrganizations,
            true
        )
        yield call(normalizeAndStore, organizations, organizationsSchema)
        organizations = yield select(getOrganizations)
        yield put(
            ActionsAuthUserProfile.Creators.userProfileOrganizationAdded(
                userDetail.OrganizationID,
                organizations[userDetail.OrganizationID].FormalName
            )
        )
        
        if(orgIDs)
        {
            yield put(
                ActionsAuthUserProfile.Creators.userProfileAllowedOrgsAdded(
                    orgIDs
                )
            )
        }
    }
}

function* onUpdate({ data }) {
    const id = yield select(getOrganizatonDetailId)
    yield call(updateApiSafely, updateOrganization, id, data)
    yield put(routerActions.navigateTo(ROUTE_ORGANIZATION_DETAIL, { Id: id }))
}

export function* onDetail() {
    const id = yield select(getOrganizatonDetailId)
    const organization = yield call(readApiSafely, getOrganization, id)
    const organizationId = yield call(
        normalizeAndStore,
        organization,
        organizationSchema
    )
    yield put(Actions.Creators.fetchOne(organizationId))
}

function* onSetOrgManager({id: userID}) {
    const orgID = yield select(getOrganizationId)
    yield put(usersActions.Creators.setRole(userID, 'org_mgr', orgID))
}

export function* organizationsSaga() {
    yield all([
        takeEvery(Actions.Types.CREATE, onCreate),
        takeEvery(Actions.Types.UPDATE, onUpdate),
        takeEvery(Actions.Types.SET_MGR, onSetOrgManager),
        fork(onRouteEnter, ROUTE_ORGANIZATIONS_EDIT, onDetail),
        fork(onRouteEnter, ROUTE_ORGANIZATION, onOrganization),
        fork(onRouteEnter, ROUTE_ORGANIZATION_DETAIL, onDetail),
    ])
}
