import { call, put, take, fork } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import Actions from "./auth-actions"
import ApiActions from "../api/api-actions"
import StyleActions from "../interactiveStyle/interactive-style-actions"
import { ServerErrorException } from "../api/exceptions/server-error-exception"
import { getSessionInfo, authLogout } from "./authClient"
import { ROUTE_ROOT } from "../routing/routes"
import { onRouteEnter } from "../routing/on-route-enter"
import { eraseLC } from "../auth/auth-credentials"
import {getLoggedUserDetails} from '../user/user-saga'
import { ToastsStore } from "react-toasts"
import { loadUserOrganizations } from "../organizations/organizations-saga"
function* init() {
    try {
        const res = yield call(getSessionInfo)

        if (res.authenticated === true) {
            localStorage.setItem("lexisToken", JSON.stringify(res.token))
            localStorage.setItem("UserId", JSON.stringify(res.auth.id))
            return res.auth
        } else {
            return null
        }
    } catch (ex) {
        if (ex instanceof ServerErrorException) {
            yield put(ApiActions.Creators.internalServerError(ex.message))

            return false
        } else {
            throw ex
        }
    }
}

export function* reloadSessionInfo(){
    const userProfile = yield call(init)
    yield put(Actions.Creators.userProfileFetched(userProfile))
}

export function* resetStateAndLoginScreen() {
    yield put(Actions.Creators.resetState())
    yield put(routerActions.navigateTo(ROUTE_ROOT))
}

export function* logout() {
    yield call(authLogout)
    yield call(eraseLC)
    yield call(resetStateAndLoginScreen)
    yield window.location.reload()
    const userProfile = yield call(init)
    yield put(Actions.Creators.userProfileFetched(userProfile))
}

export function normPermGroups(permGroups, organizationID, allowedOrganizationIDs) {
    const normPerms = {
        datasetsList: {},
        datasetsListShort: {},
        datasets: {},
        datasetsShort: {},
        datasetsPub: {},
        datasetsPubShort: {},
        projects: {},
        projectsShort: {},
        iam: {},
        iamList: null,
        org: {}
    }



    if (permGroups && permGroups.dat_list) {
        for (const perm of permGroups.dat_list) {
            normPerms.datasetsList[perm.PRJ_UUID] = true
            normPerms.datasetsListShort[perm.PRJ] = true
        }
    }

    if (permGroups && permGroups.dat_read) {
        for (const perm of permGroups.dat_read) {
            normPerms.datasets[perm.PRJ_UUID] = false
            normPerms.datasetsShort[perm.PRJ] = false
        }
    }

    if (permGroups && permGroups.dat_write) {
        for (const perm of permGroups.dat_write) {
            normPerms.datasets[perm.PRJ_UUID] = true
            normPerms.datasetsShort[perm.PRJ] = true
        }
    }

    if (permGroups && permGroups.dat_publish) {
        for (const perm of permGroups.dat_publish) {
            normPerms.datasetsPub[perm.PRJ_UUID] = true
            normPerms.datasetsPubShort[perm.PRJ] = true
        }
    }

    if (permGroups && permGroups.prj_read) {
        for (const perm of permGroups.prj_read) {
            normPerms.projects[perm.PRJ_UUID] = false
            normPerms.projectsShort[perm.PRJ] = false
        }
    }

    if (permGroups && permGroups.prj_write) {
        for (const perm of permGroups.prj_write) {
            normPerms.projects[perm.PRJ_UUID] = true
            normPerms.projectsShort[perm.PRJ] = true
        }
    }

    if (permGroups && permGroups.iam_list) {
        for (const perm of permGroups.iam_list) {
            if (perm.ORG_UUID === organizationID || allowedOrganizationIDs.includes(perm.ORG_UUID)) {
                normPerms.iamList = true
            }
        }
    }

    if (permGroups && permGroups.iam_read) {
        for (const perm of permGroups.iam_read) {
            if (perm.ORG_UUID === organizationID || allowedOrganizationIDs.includes(perm.ORG_UUID)) {
                normPerms.iam[perm.ORG_UUID] = false
            }
        }
    }

    if (permGroups && permGroups.iam_write) {
        for (const perm of permGroups.iam_write) {
            if (perm.ORG_UUID === organizationID || allowedOrganizationIDs.includes(perm.ORG_UUID)) {
                normPerms.iam[perm.ORG_UUID] = true
            }
        }
    }

    if (permGroups && permGroups.org_read) {
        for (const perm of permGroups.org_read) {
            if (perm.ORG_UUID === organizationID || allowedOrganizationIDs.includes(perm.ORG_UUID)) {
                normPerms.org[perm.ORG_UUID] = false
            }
        }
    }

    if (permGroups && permGroups.org_write) {
        for (const perm of permGroups.org_write) {
            if (perm.ORG_UUID === organizationID || allowedOrganizationIDs.includes(perm.ORG_UUID)) {
                normPerms.org[perm.ORG_UUID] = true
            }
        }
    }

    return normPerms
}

/**
 * Normalize internal fined permissions
 * @param {{}} permGroups
 * @param {string} organizationID
 * @param {[string]} allowedOrganizationIDs
 */
function* normIntlFdPerms(permGroups, organizationID, allowedOrganizationIDs) {
    const normPerms = normPermGroups(permGroups, organizationID, allowedOrganizationIDs)
    yield put(Actions.Creators.userPermissionsFetched(normPerms))
}

export function* initUserProfile() {
    try {
        const userProfile = yield call(init)
        if (userProfile) {
            const userDetail = yield call(getLoggedUserDetails, userProfile.id)
            yield fork(normIntlFdPerms, userProfile.Permissions, userDetail.OrganizationID,
                userDetail.AllowedOrganizations ? userDetail.AllowedOrganizations : [])

            yield put(StyleActions.Creators.sidebarShow())
            yield put(Actions.Creators.userProfileFetched(userProfile))
            yield call(loadUserOrganizations,userDetail)
        }

    } catch(e) {
        console.error(e)
        ToastsStore.error('Error occured while loading user information', 50000)
    }
}

export function* authSaga() {
    try {
        yield fork(initUserProfile)
        yield take(Actions.Types.LOGOUT)
        yield call(logout)
        yield fork(onRouteEnter, ROUTE_ROOT, resetStateAndLoginScreen)
    } catch (ex) {
        console.error(ex)
        yield put(ApiActions.Creators.internalServerError(ex.message))
    }
}
