import React from "react"
import { connect } from "react-redux"

import { UserProfileHeader } from "../../auth/ui/user-profile-header"
import { MainMenu } from "./main-menu"
import { isLoggedIn } from "../../auth/auth-selectors"
import { actions } from "redux-router5"
import { endsWithSegment } from "router5-helpers"

import ErrorPage from "../../error/ui/error-page"
import { ROUTE_ERROR } from "../../routing/routes"
import { getRouteName } from "../../routing/routing-selectors"
import {
    getHiddenSidebar,
    getSidebarState,
} from "../../interactiveStyle/interactive-style-selectors"
import styleActions from "../../interactiveStyle/interactive-style-actions"
import { mapRoutesToSidebarHeadings } from "../../auth/ui/user-profile-header"

const RootTemplateImpl = ({
    loggedIn,
    children,
    route,
    sidebarRendered,
    sidebarToggle,
    sidebarMiniExpansion,
    sidebarState,
    showEUNoticeInAbout,
}) => {
    const endsWith = endsWithSegment(route)

    const handleSidebarToggle = e => {
        sidebarToggle(sidebarState === "fixed" ? "mini" : "fixed")
    }

    const handleSidebarExpansion = e => {
        if (e.type === "mouseenter" && sidebarState === "mini") {
            sidebarMiniExpansion("expanded")
        }

        if (e.type === "mouseleave" && sidebarState === "mini") {
            sidebarMiniExpansion("shortened")
        }
    }

    return (
        <div className="wrapper">
            {/* <!-- Sidebar with toggler --> */}
            <div
                className="navbar-minimize-fixed"
                style={{ opacity: 0.7 }}
                hidden={sidebarRendered}>
                <button
                    onClickCapture={e => handleSidebarToggle(e)}
                    className="minimize-sidebar btn btn-link btn-just-icon">
                    <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-regular"></i>
                    <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini"></i>
                </button>
            </div>
            <div
                className="sidebar"
                hidden={sidebarRendered}
                onMouseEnter={e => handleSidebarExpansion(e)}
                onMouseLeave={e => handleSidebarExpansion(e)}>
                <div className="sidebar-wrapper">
                    <MainMenu />
                </div>
            </div>
            {/* <!-- End sidebar with toggle --> */}

            {/* <!-- Main wrapper --> */}
            <div className="main-panel">
                {/* <!-- Navbar --> */}
                <UserProfileHeader />
                {/* <!-- End Navbar --> */}

                <div className="content">
                    {loggedIn ? (
                        <>
                            <div className="row">
                                <div className="col">
                                    {endsWith(ROUTE_ERROR) ? (
                                        <ErrorPage />
                                    ) : (
                                        children
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="row">
                            <div className="col-10 px-5 pt-3">
                                {endsWith(ROUTE_ERROR) ? (
                                    <ErrorPage />
                                ) : (
                                    <>
                                        <h1>Welcome to the LEXIS portal</h1>
                                        <p>
                                            The administrator of this portal
                                            warns that this is a test
                                            environment. The administrator of
                                            the portal is therefore not
                                            responsible for its perfect
                                            functionality and warns that due to
                                            possible errors, the user cannot be
                                            provided with legal certainty and
                                            protection of the portal&apos;s services.
                                        </p>
                                        <p>
                                            You may login with your Lexis
                                            username and password. Non-Lexis
                                            users, please{" "}
                                            <a href="https://lexis-project.eu/web/contact/">
                                                contact
                                            </a>{" "}
                                            LEXIS to request the credentials to
                                            access public data.
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="col-2" />
                        </div>
                    )}
                </div>

                {/* <!-- Footer --> */}
                <footer id="footer" className="footer" hidden={sidebarRendered}>
                    <div className={`container-fluid ${showEUNoticeInAbout}`}>
                        <ul className={`nav mr-3`}>
                            <li className="nav-item">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/img/eu_flag.jpg"
                                    }
                                    className="img-fluid w-100"
                                    alt="Europe Union flag"
                                />
                            </li>
                        </ul>
                        <div className="footer-eu-info p-2">
                            <p>
                                This work was supported by the LEXIS project
                                funded by the EU&apos;s Horizon 2020 research and
                                innovation programme (2014-2020) under grant
                                agreement No 825532.
                            </p>
                        </div>
                    </div>
                </footer>
                {/* <!-- End footer --> */}
            </div>
            {/* <!-- End main wrapper --> */}
        </div>
    )
}

const mapStateToProps = state => ({
    route: getRouteName(state),
    loggedIn: isLoggedIn(state),
    sidebarRendered: getHiddenSidebar(state),
    sidebarState: getSidebarState(state),
    showEUNoticeInAbout:
        mapRoutesToSidebarHeadings(getRouteName(state)) === "About"
            ? ""
            : "d-none",
})

const mapDispatchToProps = {
    navigateTo: actions.navigateTo,
    sidebarToggle: styleActions.Creators.sidebarToggle,
    sidebarMiniExpansion: styleActions.Creators.sidebarMiniExpand,
}

export const RootTemplate = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootTemplateImpl)
