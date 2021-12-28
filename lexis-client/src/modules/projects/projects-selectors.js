import { createSelector } from "reselect"
import {
    getProjects as getProjectsState,
    getResources as getHPCResourcesState,
} from "../root/root-selectors"
import {
    getProjects as getProjectsER,
    getResources as getHPCResourcesER,
    getUsage as getProjectsUS,
    getUsers as getUsersER
} from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"
import { getOrganizationUsersIds } from "../organizations/organizations-selectors"
import { getUsers } from "../root/root-selectors"

export const getFetchingStateOfProjects = createSelector(
    getProjectsState,
    state => state.fetchInProgress
)

export const getProjects = createSelector(
    getProjectsState,
    getProjectsER,
    (state, entityRepo) => state.list.map(projectID => entityRepo[projectID])
)

export const getProjectUsersIds = createSelector(
    getProjectsState,
    (state) => state.users
)

export const getProjectUsers = createSelector(
    getProjectUsersIds,
    getUsersER,
    (ids, entityRepo) => ids.map(userID => entityRepo[userID])
)

export const getProjectUsersEmails = createSelector(
    getProjectUsers,
    users => {
        return users.map(user => user.EmailAddress)
    }
)

/**
 *  get users avaliable for assignment to project
 */
export const getProjectAssignAvalUsers = createSelector(
    getUsers,
    getProjectUsersIds,
    getUsersER,
    (users, projIds, entityRepo) => users && users.list
        .filter((orgId) => !projIds.includes(orgId))
        .map(userID => entityRepo[userID])
)

export const getProjectUserAddForm = createSelector(
    getProjectsState,
    (state) => state.addUserForm
)

export const getProjectId = createSelector(
    getRouteParams,
    routeParams => routeParams && decodeURIComponent(routeParams.id)
)

export const getProjectDetail = createSelector(
    getProjectId,
    getProjectsER,
    (id, projects) => projects[id]
)

export const getProjectStartDate = createSelector(
    getProjectId,
    getProjectsER,
    (id, projects) => projects[id] && projects[id].ProjectStartDate
)

export const getProjectsHPCResources = createSelector(
    getHPCResourcesState,
    getHPCResourcesER,
    (state, entityRepo) =>
        state.list.map(hpcresourceId => entityRepo[hpcresourceId])
)

export const getProjectUsage = createSelector(
    getProjectId,
    getProjectsUS,
    (id, usage) => usage[id]
)

export const getLastCreatedProjectId = createSelector(
    getProjectsState,
    state =>
        !state.fetchInProgress &&
        state.list &&
        state.list[state.list.length - 1]
)

export const getProjectShortName = createSelector(
    getProjectDetail,
    detail => detail.ProjectShortName
)

export const getProjectCreatedBy = createSelector(
    getProjectId,
    getProjectsER,
    (id, projects) => {
        return projects[id] && projects[id].ProjectCreatedBy
    }
)