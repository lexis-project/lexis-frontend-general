import React from "react"
import { connect } from "react-redux"
import { startsWithSegment, endsWithSegment } from "router5-helpers"
import { actions } from "redux-router5"

import { getRouteName } from "../../routing/routing-selectors"
import {
    ROUTE_ORGANIZATION,
    ROUTE_ROOT,
    ROUTE_USERS_LIST,
    ROUTE_DATA_SETS_LIST,
    ROUTE_PROJECT_LIST,
    ROUTE_WORKFLOWS_LIST,
} from "../../routing/routes"

import { version } from "../../../../package.json"
import { getUserRole } from "../../auth/auth-selectors"
import AuthCheckPermission from "../../auth/auth-check-perms"
import {
    getSidebarState,
    getSidebarMiniState,
} from "../../interactiveStyle/interactive-style-selectors"
import { CheckAnyListDatPerms, CheckIAMListPerms, HasAnyProjectList } from "../../auth/auth-check-fine-perms"

export const MainMenuImpl = ({
    route,
    navigateTo,
    userRole,
    sidebarMiniState,
}) => {
    const startsWith = startsWithSegment(route)
    //last part of URL address
    const endsWith = endsWithSegment(route)

    const changeRoute = where => ev => {
        //do not apply browser's default behaviour
        ev.preventDefault()

        if (!endsWith(where)) {
            navigateTo(where)
        }
    }

    return (
        <>
            <ul className="nav" cy="main-menu">
                <li className="nav-item my-4 ml-2">
                    <button
                        type="button"
                        className="nav-link btn btn-link"
                        active={startsWith(ROUTE_DATA_SETS_LIST).toString()}
                        onClick={changeRoute(ROUTE_DATA_SETS_LIST)}
                        cy="main-menu-datasets">
                        <p>
                            <span className="white mx-1">
                                <i className="tim-icons icon-single-copy-04"></i>
                            </span>{" "}
                            <span
                                className={`menu-item-name ${sidebarMiniState}`}>
                                   Data Sets
                            </span>
                        </p>
                    </button>
                </li>
                <AuthCheckPermission
                    permissionName="read-organization"
                    userRole={userRole}>
                    <li className="nav-item my-4 ml-2">
                        <button
                            type="button"
                            className="nav-link btn btn-link"
                            active={startsWith(ROUTE_ORGANIZATION).toString()}
                            onClick={changeRoute(ROUTE_ORGANIZATION)}
                            cy="main-menu-organization">
                            <p>
                                <span className="white mx-1">
                                    <i className="tim-icons icon-bank"></i>
                                </span>{" "}
                                <span
                                    className={`menu-item-name ${sidebarMiniState}`}>
                                    Organization
                                </span>
                            </p>
                        </button>
                    </li>
                </AuthCheckPermission>
                <HasAnyProjectList>
                    <li className="nav-item my-4 ml-2">
                        <button
                            type="button"
                            className="nav-link btn btn-link"
                            active={startsWith(ROUTE_PROJECT_LIST).toString()}
                            onClick={changeRoute(ROUTE_PROJECT_LIST)}
                            cy="main-menu-projects">
                            <p>
                                <span className="white mx-1">
                                    <i className="tim-icons icon-notes"></i>
                                </span>{" "}
                                <span
                                    className={`menu-item-name ${sidebarMiniState}`}>
                                    Projects
                                </span>
                            </p>
                        </button>
                    </li>
                </HasAnyProjectList>
                <CheckIAMListPerms>
                    <li className="nav-item my-4 ml-2">
                        <button
                            type="button"
                            className="nav-link btn btn-link"
                            active={startsWith(ROUTE_USERS_LIST).toString()}
                            onClick={changeRoute(ROUTE_USERS_LIST)}
                            cy="main-menu-users">
                            <p>
                                <span className="white mx-1">
                                    <i className="tim-icons icon-single-02"></i>
                                </span>{" "}
                                <span
                                    className={`menu-item-name ${sidebarMiniState}`}>
                                    Users
                                </span>
                            </p>
                        </button>
                    </li>
                </CheckIAMListPerms>
                <HasAnyProjectList>
                    <li className="nav-item my-4 ml-2">
                        <button
                            type="button"
                            className="nav-link btn btn-link"
                            active={startsWith(ROUTE_WORKFLOWS_LIST).toString()}
                            onClick={changeRoute(ROUTE_WORKFLOWS_LIST)}
                            cy="main-menu-workflows">
                            <p>
                                <span className="white mx-1">
                                    <i className="tim-icons icon-components"></i>
                                </span>{" "}
                                <span
                                    className={`menu-item-name ${sidebarMiniState}`}>
                                    Workflows
                                </span>
                            </p>
                        </button>
                    </li>
                </HasAnyProjectList>
                <li className="nav-item my-4 ml-2">
                    <button
                        type="button"
                        className="nav-link btn btn-link"
                        active={endsWith(ROUTE_ROOT).toString()}
                        onClick={changeRoute(ROUTE_ROOT)}
                        cy="main-menu-about">
                        <p>
                            <span className="white mx-1">
                                <i className="tim-icons icon-bulb-63"></i>
                            </span>{" "}
                            <span
                                className={`menu-item-name ${sidebarMiniState}`}>
                                About LEXIS
                            </span>
                        </p>
                    </button>
                </li>
            </ul>
            <div id="versionInfo" className={`${sidebarMiniState} ml-2`}>
                <p>
                    v{version}
                </p>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    const sidebarMiniState = () => {
        if (
            getSidebarMiniState(state) === "" &&
            getSidebarState(state) === "mini"
        ) {
            return "shortened"
        }

        return getSidebarState(state) === "fixed"
            ? "expanded"
            : getSidebarMiniState(state)
    }

    return {
        route: getRouteName(state),
        userRole: getUserRole(state),
        sidebarMiniState: sidebarMiniState(),
    }
}

const mapDispatchToProps = {
    navigateTo: actions.navigateTo,
}

export const MainMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainMenuImpl)
