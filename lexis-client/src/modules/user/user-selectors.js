import { createSelector } from "reselect"
import { getAuth as getState } from "../root/root-selectors"

export const getUserProfileID = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.id
)

export const getFirstname = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.firstname
)

export const getLastname = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.lastname
)

export const getUserEmail = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.email
)

export const getUserEmailVerified = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.emailverified
)

export const getUserRole = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.role
)

export const getOrganizationId = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.organizationId
)

export const getOrganizationName = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.organizationName
)

export const getAllowedOrganizations = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.allowedOrganizations
)

export const getProfilesUsername = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.username
)
