import { createSelector } from "reselect"
import { getOrganizations as getState } from "../root/root-selectors"
import {
    getOrganizations as getOrganizationsER,
    getUsers as getUsersER
} from "../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../routing/routing-selectors"

export const getOrganizations = createSelector(
    getState,
    getOrganizationsER,
    (state, entityRepo) =>
        state.list.map(organizationId => entityRepo[organizationId])
)

export const getOrganizatonDetailId = createSelector(
    getRouteParams,
    routeParams => routeParams.Id
)

export const getOrganizationDetail = createSelector(
    getOrganizatonDetailId,
    getOrganizationsER,
    (ID, organizations) => organizations[ID]
)

export const getOrganizationUsersIds = createSelector(
    getState,
    (state) => state && state.users
)

export const getOrganizationUsers = createSelector(
    getOrganizationUsersIds,
    getUsersER,
    (ids, entityRepo) => ids.map(userID => entityRepo[userID])
)

export const getOrganizationUsernames = createSelector(
    getOrganizationUsersIds,
    getUsersER,
    (ids, entityRepo) => ids.map(userID => entityRepo[userID].username)
)

