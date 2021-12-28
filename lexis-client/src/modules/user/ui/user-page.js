import React, { Fragment } from "react"
import { connect } from "react-redux"
import { isLoggedIn } from "../../auth/auth-selectors"
import {
    getFirstname,
    getLastname,
    getUserEmailVerified,
    getUserEmail,
    getUserRole,
    getOrganizationId,
    getOrganizationName,
    getAllowedOrganizations,
    getUserProfileID,
    getProfilesUsername
} from "../../user/user-selectors"
import { actions } from "redux-router5"
import { ROUTE_USER_PROFILE_EDIT } from "../../routing/routes"
import { getTokenLC } from "../../auth/auth-credentials"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"

const lexisToken = getTokenLC()

const UserPageImp = ({ userData, gotoRoute }) => {
    const {allowedOrganizations, organizations} = userData
    const userAllowedList = allowedOrganizations && allowedOrganizations.filter(id => organizations[id])
    return(
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>User Profile</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-9">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <p>Username:</p>
                                </div>
                                <div className="col">
                                    <p>{userData.username}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>First Name:</p>
                                </div>
                                <div className="col">
                                    <p>{userData.FirstName}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Last Name:</p>
                                </div>
                                <div className="col">
                                    <p>{userData.LastName}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Account Verified:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        {accountVerifiedTranslator(
                                            userData.accountVerified
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Email Address:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <a href={"mailto:" + userData.EmailAddress}>
                                            {userData.EmailAddress}
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Organization:</p>
                                </div>
                                <div className="col">
                                    <p>{userData.organization}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Organization ID (short):</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <code>
                                            {userData.organizationId
                                                ? userData.organizationId.substring(
                                                    0,
                                                    8
                                                )
                                                : null}
                                        </code>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>User ID:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <code>
                                            {userData.userID}
                                        </code>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Job Title:</p>
                                </div>
                                <div className="col">
                                    <p>{userData.jobTitle}</p>
                                </div>
                            </div>
                            { allowedOrganizations && userAllowedList.length>0 &&<div className="row">
                                <div className="col-4">
                                    <p>Allowed Organizations:</p>
                                </div>
                                <div className="col ">
                                    <p className="font-weight-light">{userAllowedList.map(id => organizations[id].FormalName).join(', ')}</p>
                                </div>
                                
                            </div> }
                            <div className="row">
                                <div className="col-4">
                                    <p>User role:</p>
                                </div>
                                <div className="col">
                                    <p>{userData.role}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Keycloak token:</p>
                                </div>
                                <div className="col">
                                    <div
                                        className="mt-2 text-secondary"
                                        style={{ maxWidth: "570px" }}>
                                        <p>
                                            <code>{lexisToken}</code>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <div className="col-10">
                    <div
                        className="btn-toolbar"
                        role="toolbar"
                        aria-label="Toolbar with button groups">
                        <button
                            type="button"
                            className="btn btn-success btn-simple text-nowrap"
                            onClick={() => gotoRoute(ROUTE_USER_PROFILE_EDIT)}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-settings"></i>
                            </span>{" "}
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )}

const accountVerifiedTranslator = status => {
    switch (status) {
    case true:
        return "YES"

    case false:
        return "NO"
    default:
        return "-"
    }
}

const mapStateToProps = state => ({
    loggedIn: isLoggedIn(state),
    userData: {
        FirstName: getFirstname(state),
        LastName: getLastname(state),
        accountVerified: getUserEmailVerified(state),
        EmailAddress: getUserEmail(state),
        organization: getOrganizationName(state),
        organizationId: getOrganizationId(state),
        organizations: getOrganizations(state),
        allowedOrganizations: getAllowedOrganizations(state),
        jobTitle: "not assigned",
        userID: getUserProfileID(state),
        //organizationLink: "not assigned",
        role: getUserRole(state),
        username: getProfilesUsername(state)
    },
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

export const UserPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPageImp)
