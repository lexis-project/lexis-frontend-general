import { createActions } from "reduxsauce"

export default createActions(
    {
        userProfileFetched: ["userProfile"], // AUTH_USER_PROFILE_FETCHED
        userPermissionsFetched: ["permissions"], // AUTH_USER_PERMISSIONS_FETCHED
        userProfileOrganizationAdded: ["organizationId", "organizationName"], // AUTH_USER_PROFILE_ORGANIZATION_ADDED
        userProfileAllowedOrgsAdded: ["allowedOrganizations"], // AUTH_USER_PROFILE_ALLOWED_ORGS_ADDED
        usersPermissionsFetched: ["userId", "projectId", "userNormPerm"],
        logout: null, // AUTH_LOGOUT
        resetState: null, // AUTH_RESET_STATE
        userProfileEdited: ["firstname", "lastname", "email"], // AUTH_USER_PROFILE_EDITED
        usernameToState: ["usr"],  // type USERS_USERNAME_TO_STATE
        usernameError: ["err"] // type USERS_USERNAME_ERROR
    },
    { prefix: "AUTH_" }
)
