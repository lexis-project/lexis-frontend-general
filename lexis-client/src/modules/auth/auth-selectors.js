import { createSelector } from "reselect"
import { getAuth as getState } from "../root/root-selectors"

export const isLoggedIn = createSelector(getState, state =>
    Boolean(state.user && state.user.profile && state.user.profile.id)
)

export const getUserName = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.username
)

export const getSessionId = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.id
)

export const getAuthUserEmail = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.email
)

export const getUserRole = createSelector(
    getState,
    state => state.user && state.user.profile && state.user.profile.role
)

export const getUserFinePerms = createSelector(
    getState,
    state => state.user && state.user.permissions
)

export const getUsernameError = createSelector(
    getState,
    state => state.user && state.user.profile.errorString
)

export const getUsersNormPerms = createSelector(
    getState,
    state => state.usersNormPerms
)

export const getUsersNormPermsPrj = (state, ownProps) => createSelector(
    getUsersNormPerms,
    (state) => state[ownProps.usrId] 
        && state[ownProps.usrId][ownProps.prjId]
)(state)