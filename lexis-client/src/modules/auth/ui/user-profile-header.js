import React from "react"
import { connect } from "react-redux"

import { endsWithSegment } from "router5-helpers"
import { getUserName, isLoggedIn } from "../auth-selectors"
import { getFirstname, getLastname, getOrganizationId, getOrganizationName } from "../../user/user-selectors"
import Actions from "../auth-actions"
import { getRouteName } from "../../routing/routing-selectors"
import { actions } from "redux-router5"
import { ROUTE_ORGANIZATION_DETAIL, ROUTE_USER_PROFILE } from "../../routing/routes"

import conf from "../../../config"

import LexisLogo from "../../../assets/img/logo_LEXIS.svg"

const UserProfileHeaderImpl = ({
    route,
    navigateTo,
    loggedIn,
    username,
    logout,
    routeHeading,
    organizationId,
    organizationName
}) => {
    const endsWith = endsWithSegment(route)

    const changeRoute = where => ev => {
        ev.preventDefault()

        if (!endsWith(where)) {
            navigateTo(where)
        }
    }

    if (loggedIn) {
        return (
            <nav
                className="navbar navbar-expand-md navbar-absolute navbar-transparent"
                style={{ top: "0px", transition: "all 0.5s linear 0s" }}>
                <div className="container-fluid">
                    <div className="navbar-wrapper">
                        <div className="navbar-minimize-fixed d-inline"></div>
                        <div className="navbar-toggle d-inline">
                            <button type="button" className="navbar-toggler">
                                <span className="navbar-toggler-bar bar1"></span>
                                <span className="navbar-toggler-bar bar2"></span>
                                <span className="navbar-toggler-bar bar3"></span>
                            </button>
                        </div>
                        <span className="navbar-brand" id="navbar-brand">
                            {routeHeading}
                        </span>
                    </div>

                    <div className="d-inline-block">
                        <img
                            src={LexisLogo}
                            className="img-fluid"
                            width="121"
                            height="44"
                            alt="LEXIS Logo"
                        />
                    </div>

                    <div className="collapse d-inline-block" id="navigation">
                        <ul className="navbar-nav d-inline-block">
                            {organizationId && (<li className="nav-item user-profile" style={{borderRight: ' white solid 2px'}}>
                                <button
                                    id="user-organization"
                                    onClick={()=>navigateTo(ROUTE_ORGANIZATION_DETAIL, {Id: organizationId})}
                                    alt="Assigned organization" className=" btn btn-link nav-link font-weight-light" style={{color:'rgba(255,255,255,0.7)', paddingRight:'.2rem'}}>
                                    {organizationName ? organizationName : organizationId}
                                </button>
                            </li>)}
                            <li className="nav-item user-profile">
                                <button
                                    className="btn btn-link nav-link"
                                    id="user-profile-button"
                                    onClick={changeRoute(ROUTE_USER_PROFILE)}>
                                    <span
                                        className="d-inline-block"
                                        style={{
                                            color:
                                                "rgb(253, 253, 253) !important",
                                        }}>
                                        User: {username}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item d-inline-block">
                                <button
                                    onClick={logout}
                                    id="logout-button"
                                    className="nav-link btn btn-simple btn-tumblr">
                                    <span
                                        className="white"
                                        style={{
                                            color:
                                                "rgb(253, 253, 253) !important",
                                        }}>
                                        <i
                                            className="tim-icons icon-button-power"
                                            style={{
                                                fontSize: "inherit",
                                                verticalAlign: "text-top",
                                            }}></i>{" "}
                                        Logout
                                    </span>
                                </button>
                            </li>
                            <li className="separator d-lg-none"></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else {
        return (
            <>
                <nav
                    className="navbar navbar-expand-md navbar-absolute navbar-transparent"
                    style={{ top: "0px", transition: "all 0.5s linear 0s" }}>
                    <div className="container-fluid d-block">
                        <div className="d-inline-block">
                            <img
                                src={LexisLogo}
                                className="img-fluid"
                                width="121"
                                height="44"
                                alt="LEXIS Logo"
                            />
                        </div>

                        <div
                            className="collapse d-inline-block"
                            id="navigation">
                            <ul className="navbar-nav d-inline-block">
                                <li className="nav-item d-inline-block">
                                    <button
                                        onClick={() => {
                                            window.location.href = `${conf.url.auth}/auth${conf.portalActions.login}`
                                        }}
                                        id="login-button"
                                        className="nav-link btn btn-simple btn-tumblr btn-lg">
                                        <span className="white">Login</span>
                                    </button>
                                </li>
                                <li className="separator d-lg-none"></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}

const isNameDefined = (userName, firstname, lastname) => {
    if (firstname !== "" && lastname !== "") {
        return firstname + " " + lastname
    } else {
        return userName
    }
}

export const mapRoutesToSidebarHeadings = route => {
    if (/^root$/.test(route)) {
        return "About"
    }
    if (/\.workflow/.test(route)) {
        return "Workflows"
    }
    if (/\.users/.test(route)) {
        return "Users"
    }
    if (/\.profile/.test(route)) {
        return "User Profile"
    }
    if (/\.projects/.test(route)) {
        return "Projects"
    }
    if (/\.organization/.test(route)) {
        return "Organization"
    }
    if (/\.datasets/.test(route)) {
        return "Data Sets"
    } else {
        return ""
    }
}

const mapStateToProps = state => ({
    loggedIn: isLoggedIn(state),
    username: isNameDefined(
        getUserName(state),
        getFirstname(state),
        getLastname(state)
    ),
    route: getRouteName(state),
    organizationName: getOrganizationName(state),
    organizationId: getOrganizationId(state),
    routeHeading: mapRoutesToSidebarHeadings(getRouteName(state)),
})

const mapDispatchToProps = {
    logout: Actions.Creators.logout,
    navigateTo: actions.navigateTo,
}

export const UserProfileHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileHeaderImpl)
