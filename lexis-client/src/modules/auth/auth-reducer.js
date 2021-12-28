import { createReducer } from "reduxsauce"
import { pick } from "lodash"
import Actions from "./auth-actions"

const INITIAL_STATE = {
    user: null,
    usersNormPerms: {}
}

const onUsersNormPermissionsFetched = (state, { userId, projectId, userNormPerm }) => {
    const userPerms = state.usersNormPerms[userId] ? state.usersNormPerms[userId] : {}
    return ({
        ...state,
        usersNormPerms: {
            ...state.usersNormPerms,
            [userId]: {
                ...userPerms,
                [projectId]: userNormPerm
            }
        },
    })}

const onUserProfileFetched = (state, { userProfile }) => ({
    ...state,
    user: {
        ...state.user, 
        profile: pick(userProfile, [
            'username', 'firstname', 'lastname', 'email', 'emailverified', 'role', 'id' 
        ])},
})

const onUserPermissionsFetched = (state, { permissions }) => ({
    ...state,
    user: {
        ...state.user,
        permissions
    },
})

const onUserProfileOrganizationAdded = (state, { organizationId, organizationName }) => ({
    ...state,
    user: {
        ...state.user,
        profile: {
            ...state.user.profile,
            organizationId,
            organizationName
        },
    },
})


const onUserProfileAllowedOrganizationAdded = (state, { allowedOrganizations }) => ({
    ...state,
    user: {
        ...state.user,
        profile: {
            ...state.user.profile,
            /**
             * @type {[string]} array of ids
             */
            allowedOrganizations
        },
    },
})

const onUserProfileEdited = (state, { firstname, lastname, email }) => ({
    ...state,
    user: {
        ...state.user,
        profile: {
            ...state.user.profile,
            firstname: firstname,
            lastname: lastname,
            email: email
        },
    },
})

const onAddingUsername = (state, { usr }) => ({
    ...state,
    user: {
        ...state.user,
        profile: {
            ...state.user.profile,
            username: usr
        },
    },

})

const onUsernameError = (state, { err }) => ({
    ...state,
    user: {
        ...state.user,
        profile: {
            errorString: err,
            errorMessage: "Creating your unique username of the LEXIS Portal failed. Try again, please."
        },
    },

})

const HANDLERS = {
    [Actions.Types.USER_PROFILE_FETCHED]: onUserProfileFetched,
    [Actions.Types.USER_PERMISSIONS_FETCHED]: onUserPermissionsFetched,
    [Actions.Types
        .USER_PROFILE_ORGANIZATION_ADDED]: onUserProfileOrganizationAdded,
    [Actions.Types.USERNAME_TO_STATE]: onAddingUsername,
    [Actions.Types.USERNAME_ERROR]: onUsernameError,
    [Actions.Types.USER_PROFILE_ALLOWED_ORGS_ADDED]: onUserProfileAllowedOrganizationAdded,
    [Actions.Types.USER_PROFILE_EDITED]: onUserProfileEdited,
    [Actions.Types.USERS_PERMISSIONS_FETCHED]: onUsersNormPermissionsFetched
}

export const authReducer = createReducer(INITIAL_STATE, HANDLERS)
