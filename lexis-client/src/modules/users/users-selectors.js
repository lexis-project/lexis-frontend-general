import { createSelector } from "reselect"
import { getUsers as getState } from "../root/root-selectors"
import { getUsers as getUsersER } from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"
import { getUserProfileID } from "../user/user-selectors"
import { getProjectCreatedBy } from "../projects/projects-selectors"
import { getAuth as getCurrentUserFromAuth } from "../root/root-selectors"
export const getUsers = createSelector(
    getState,
    getUsersER,
    (state, entityRepo) => state.list.map(userId => entityRepo[userId])
)

export const getUsersEmails = createSelector(getUsers, users =>
    users.map(user => user.EmailAddress)
)

export const getUsersDetailId = createSelector(
    getRouteParams,
    routeParams => routeParams.Id
)

export const getUsersDetail = createSelector(
    getUsersDetailId,
    getUsersER,
    (id, users) => users[id]
)

export const getUserCreatedByEmail = createSelector(
    getProjectCreatedBy,
    getUsersER,
    (id, users) => users[id] && users[id].EmailAddress
)

export const getLoggedInUsersDetail = createSelector(
    getUserProfileID,
    getUsersER,
    (id, users) => users[id]
)

export const getCurrentUser = createSelector(
    getCurrentUserFromAuth,
    state => state && state.user
)

export const getFirstName = createSelector(
    getCurrentUser,
    state => state && state.profile.firstname
)

export const getLastName = createSelector(
    getCurrentUser,
    state => state && state.profile.lastname
)

export const getEmail = createSelector(
    getCurrentUser,
    state => state && state.profile.email
)

export const getLoginUsername = createSelector(
    getCurrentUser,
    state => state && state.profile.username
)