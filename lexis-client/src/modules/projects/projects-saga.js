import { all, call, takeEvery, put, fork, select, delay, take } from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import ActionsProjects from "./projects-actions"
import ActionsUsers from "../users/users-actions"
import {
    listProjects,
    getProject,
    createProject,
    updateProject,
    getUser,
    // FIXME - temporary commented until there's ready approval system
    // listHPCApprovedResourcesRequests,
    getProjectUsage,
    getOrganizationUsers,
    updateUsers,
    // FIXME - temporary commented until there's ready approval system
    // listHPCResourcesRequests
    listHPCresources,
    addRoleToUser,
    listUsers,
    assignUserToProject
} from "../api/client"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import {
    project as projectSchema,
    projects as projectsSchema,
    // FIXME - temporary commented until there's ready approval system
    // approvedResourceRequests as approvedResourceRequestsSchema,
    usage as usageSchema,
    // FIXME - temporary commented until there's ready approval system
    // resourceRequests as resourceRequestsSchema,
    users as usersSchema,
    hpcResources as hpcResourcesSchema,
    user
} from "../api/schema"
import {
    ROUTE_PROJECT_LIST,
    ROUTE_PROJECT_DETAIL,
    ROUTE_PROJECT_EDIT,
    ROUTE_PROJECT_RESOURCE_LIST,
    ROUTE_PROJECT_USAGE,
    ROUTE_WORKFLOW_CREATE,
    ROUTE_PROJECT_CREATE,
    ROUTE_PROJECT_RESOURCE_REQUEST_LIST,
    ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_LIST,
    ROUTE_PROJECT_USERS_MANAGEMENT,
    ROUTE_PROJECT_RESOURCE_CREATEAPPROVED
} from "../routing/routes"
import { onRouteEnter } from "../routing/on-route-enter"
import { getProjectId, getLastCreatedProjectId, getProjectShortName, getProjectDetail } from "./projects-selectors"
import {
    readApiSafely,
    createApiSafely,
    updateApiSafely,
} from "../api/api-saga"
import { getUserIdLC } from "../auth/auth-credentials"
// FIXME - temporary commented until there's ready approval system
// import approvedResourcesRequestsActions from "./resources-requests-approved/resources-requests-actions"
// import resourcesRequestsActions from "./resources-requests-dynamic/resources-requests-actions"
import hpcResourcesActions from "./resources/list-hpc-resources-actions"
import { getUserFinePerms } from "../auth/auth-selectors"
import projectsActions from "./projects-actions"
import { getUsers } from "../entity-repository/entity-repository-selectors"
import usersActions from "../users/users-actions"
import { reloadSessionInfo } from "../auth/auth-saga"
import config from "../../config"
import { onList as onUsersList } from "../users/users-saga"
import { getOrganizationId } from "../user/user-selectors"
import { checkIAMListPerms, getUserPermsByProjectId } from "../auth/auth-check-fine-perms"
import authActions from "../auth/auth-actions"
import { getLoggedInUsersDetail } from "../users/users-selectors"

const isLocalDevelopment = /^http:\/\/localhost.3000/.test(config.url.base) // FIXME hacky temporary solution needed for testing, sorry

export function* onList() {
    try {
        yield put(ActionsProjects.Creators.listFetchStart())

        const projects = yield call(readApiSafely, listProjects)
        const projectsIds = yield call(
            normalizeAndStore,
            projects,
            projectsSchema
        )
        yield put(ActionsProjects.Creators.listFetch(projectsIds))

        yield put(ActionsProjects.Creators.listFetchSuccess())
    } catch (err) {
        console.error("Error in saga for fetching list of projects - ", err)

        yield put(ActionsProjects.Creators.listFetchError(err))
    }
}

const filterUserByProjectId = projId => user =>
    user.Projects && user.Projects.includes(projId)

function* onProjectUsersManagement() {
    let perms = yield select(getUserFinePerms)
    let fTries = 0
    while(!perms && fTries < 5)
    {
        fTries+=1
        yield delay(500)
        perms = yield select(getUserFinePerms)
    }
    if(perms && checkIAMListPerms(perms))
    {
        const projectId = yield select(getProjectId)

        const project = yield call(readApiSafely, getProject, projectId)
        yield call(normalizeAndStore, project, projectSchema)
        const usersWperms = yield call(readApiSafely, listUsers, projectId, true, true)
        for (let i = 0; i < usersWperms.length; i++) {
            const user = usersWperms[i];
            yield put(authActions.Creators.usersPermissionsFetched(user.ID, projectId, getUserPermsByProjectId(projectId, user.Permissions)))
        }
        const users = yield call(readApiSafely, listUsers, null, true, false)
        const usersIds = yield call(normalizeAndStore, users, usersSchema)
        yield put(usersActions.Creators.listFetched(usersIds))

        const projectUsersIds = users
            .filter(filterUserByProjectId(projectId))
            .map(user => user.ID)
        yield put(projectsActions.Creators.usersFetch(projectUsersIds))
    }
}

export function* fetchPrjResources(projectID) {
    try {
        // yield put(resourcesRequestsActions.Creators.listFetchStart())

        // FIXME - temporary commented until there's ready approval system
        // const resourcesRequests = yield call(readApiSafely, listHPCResourcesRequests, projectId)
        // const resourcesRequestsIds = yield call(normalizeAndStore, resourcesRequests, resourceRequestsSchema)
        // yield put(resourcesRequestsActions.Creators.listFetch(resourcesRequestsIds))

        // yield put(resourcesRequestsActions.Creators.listFetchSuccess())

        // const approvedResourcesRequests = yield call(readApiSafely, listHPCApprovedResourcesRequests, projectId)
        // const approvedResourcesRequestsIds = yield call(normalizeAndStore, approvedResourcesRequests, approvedResourceRequestsSchema)
        // yield put(approvedResourcesRequestsActions.Creators.listFetch(approvedResourcesRequestsIds))

        yield put(hpcResourcesActions.Creators.listFetchStart())

        const hpcResourcesAll = yield call(readApiSafely, listHPCresources)
        const hpcResources = hpcResourcesAll.filter(resource => resource.AssociatedLEXISProject === projectID)
        const hpcResourcesIds = yield call(normalizeAndStore, hpcResources, hpcResourcesSchema)
        yield put(hpcResourcesActions.Creators.listFetch(hpcResourcesIds))

        yield put(hpcResourcesActions.Creators.listFetchSuccess())
    } catch (err) {
        console.error(
            "Error in saga for fetching list of approved and/or resources requests and/or HPC resources - ",
            err
        )

        // yield put(resourcesRequestsActions.Creators.listFetchError(err))
        // yield put(approvedResourcesRequestsActions.Creators.listFetchError(err))
        yield put(hpcResourcesActions.Creators.listFetchError())
    }
}

function* onDetail() {
    const projectId = yield select(getProjectId)
    const project = yield call(readApiSafely, getProject, projectId)
    yield call(normalizeAndStore, project, projectSchema)

    yield call(fetchPrjResources, projectId)
}

function* onCreate({ data }) {
    data.ProjectStatus = "ACTIVE"
    data.ProjectCreatedBy = getUserIdLC()
    const userInfo = yield select(getLoggedInUsersDetail)
    let projectContactEmail = data.ProjectContactEmail

    let users
    try {
        yield put(ActionsUsers.Creators.listFetchStart())

        users = yield call(readApiSafely, listUsers, null, true)
        const usersIds = yield call(normalizeAndStore, users, usersSchema)
        yield put(ActionsUsers.Creators.listFetched(usersIds))

        yield put(ActionsUsers.Creators.listFetchSuccess())

        // reload user permissions
        yield call(reloadSessionInfo)

    } catch (err) {
        console.error("Error in saga for fetching list of users - ", err)

        yield put(ActionsUsers.Creators.listFetchError(err))
    }

    if(projectContactEmail === undefined)
    {
        projectContactEmail = userInfo.EmailAddress
    }
    if(data.LinkedOrganization === undefined)
    {
        data.LinkedOrganization = userInfo.OrganizationID
    }

    const projectContactPerson = users.find(
        user => user.EmailAddress === projectContactEmail
    ).ID

    data.ProjectContactPerson = projectContactPerson

    let projectCreated = yield call(createApiSafely, createProject, data)

    if (projectCreated.INVALID_PROJECT_SHORT_NAME !== true) {
        yield call(onList)
        yield put(routerActions.navigateTo(ROUTE_PROJECT_LIST))

        const projectCreatedId = yield select(getLastCreatedProjectId)
        yield put(
            routerActions.navigateTo(ROUTE_PROJECT_DETAIL, {
                id: projectCreatedId,
            })
        )
    }
}

function* onUpdate({ data }) {
    const id = yield select(getProjectId)

    const projectContactEmail = data.ProjectContactEmail

    let users
    try {
        yield put(ActionsUsers.Creators.listFetchStart())

        users = yield call(readApiSafely, listUsers, null, true)
        const usersIds = yield call(normalizeAndStore, users, usersSchema)
        yield put(ActionsUsers.Creators.listFetched(usersIds))

        yield put(ActionsUsers.Creators.listFetchSuccess())
    } catch (err) {
        console.error("Error in saga for fetching list of users - ", err)

        yield put(ActionsUsers.Creators.listFetchError(err))
    }

    const projectContactPerson = users.find(
        user => user.EmailAddress === projectContactEmail
    ).ID

    data.ProjectContactPerson = projectContactPerson

    yield call(updateApiSafely, updateProject, id, data)
    yield put(routerActions.navigateTo(ROUTE_PROJECT_DETAIL, { id: id }))
}

function* onUsage() {
    const projectId = yield select(getProjectId)
    const usage = yield call(readApiSafely, getProjectUsage, projectId)

    yield call(normalizeAndStore, usage, usageSchema)
}

function* onUserAssignment({ data }) {
    const usrID = data["add-user"].value
    const projID = yield select(getProjectId)
    try {
        yield call(readApiSafely, assignUserToProject, projID, usrID)
        yield put(projectsActions.Creators.showUserAddForm())
        yield call(onProjectUsersManagement)
    } catch (e) {
        console.error(e)
    }
}

function* onUserUnAssignment({ id: usrID }) {
    const projID = yield select(getProjectId)
    const usersER = yield select(getUsers)
    const userProjects = usersER[usrID].Projects
    try {
        const body = {
            Projects: userProjects.filter(proj => proj !== projID),
        }
        yield call(updateApiSafely, updateUsers, usrID, body)
        yield call(onProjectUsersManagement)
    } catch (e) {
        console.error(e)
    }
}

function* onSetRole({id: userID, role}) {
    const users = yield select(getUsers)
    const user = users[userID]
    const orgID = user.OrganizationID
    const projectID = yield select(getProjectId)
    const projectDetail = yield select(getProjectDetail)
    const projectShortName = projectDetail.ProjectShortName
    yield put(usersActions.Creators.setRole(userID, role, orgID, projectID, projectShortName))
    yield take(usersActions.Types.SET_ROLE_DONE)
    yield call(onProjectUsersManagement)
}

export function* projectsSaga() {
    yield all([
        takeEvery(ActionsProjects.Types.CREATE, onCreate),
        takeEvery(ActionsProjects.Types.UPDATE, onUpdate),
        fork(onRouteEnter, ROUTE_PROJECT_LIST, onList),
        fork(onRouteEnter, ROUTE_WORKFLOW_CREATE, onList),
        fork(onRouteEnter, ROUTE_PROJECT_CREATE, onList),
        fork(onRouteEnter, ROUTE_PROJECT_DETAIL, onUsersList),
        fork(onRouteEnter, ROUTE_PROJECT_CREATE, onUsersList),
        fork(onRouteEnter, ROUTE_PROJECT_EDIT, onDetail),
        fork(onRouteEnter, ROUTE_PROJECT_EDIT, onUsersList),
        fork(onRouteEnter, ROUTE_PROJECT_DETAIL, onDetail),
        fork(onRouteEnter, ROUTE_PROJECT_RESOURCE_LIST, onDetail),
        fork(onRouteEnter, ROUTE_PROJECT_RESOURCE_REQUEST_LIST, onDetail),
        fork(
            onRouteEnter,
            ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_LIST,
            onDetail
        ),
        fork(onRouteEnter, ROUTE_PROJECT_USAGE, onUsage),
        fork(
            onRouteEnter,
            ROUTE_PROJECT_USERS_MANAGEMENT,
            onProjectUsersManagement
        ),
        fork(onRouteEnter, ROUTE_PROJECT_DETAIL, onProjectUsersManagement),
        fork(onRouteEnter, ROUTE_PROJECT_RESOURCE_CREATEAPPROVED, onProjectUsersManagement),
        takeEvery(ActionsProjects.Types.ASSIGN_USER, onUserAssignment),
        takeEvery(ActionsProjects.Types.UNASSIGN_USER, onUserUnAssignment),
        takeEvery(ActionsProjects.Types.SET_ROLE, onSetRole)
    ])
}
