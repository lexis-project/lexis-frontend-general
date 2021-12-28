import React, { Fragment } from "react"

import { connect } from "react-redux"
import { actions } from "redux-router5"

import {
    ROUTE_PROJECT_CREATE,
    ROUTE_PROJECT_DETAIL,
    ROUTE_PROJECT_USAGE,
} from "../../routing/routes"
import { getProjects, getFetchingStateOfProjects } from "../projects-selectors"

import { getUserFinePerms, getUserRole } from "../../auth/auth-selectors"
import { checkFineReadPerms, checkAnyProjWrite, checkAnyOrgWritePerms } from "../../auth/auth-check-fine-perms"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"


export const ProjectListImplementation = ({
    gotoRoute,
    projects,
    listFetchInProgress,
    userRole,
    perms,
    organizations
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Projects</h1>
            </div>
            {(checkAnyProjWrite(perms) || checkAnyOrgWritePerms(perms)) &&
                <div className="col-4" style={{ textAlign: "right" }}>
                    <button
                        type="button"
                        className="btn btn-info btn-simple text-nowrap"
                        onClick={() => gotoRoute(ROUTE_PROJECT_CREATE)}
                        cy="project-btn-create-new">
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
                        Create new LEXIS project
                    </button>
                </div>
            }
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="table-responsive">
                            {listFetchInProgress ? (
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="spinner-border text-light m-5"
                                        role="status"
                                        style={{
                                            width: "3rem",
                                            height: "3rem",
                                        }}>
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <table
                                    className="table table-striped table-bordered table-hover"
                                    cy="projects-list-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Organization</th>
                                            <th>Norm. core hours</th>
                                            <th>Max price (euro)</th>
                                            <th>Status</th>
                                            <th>Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    The list of projects is
                                                    empty so far.
                                                </td>
                                            </tr>
                                        )}
                                        {projects.map(
                                            ({
                                                ProjectID,
                                                ProjectName,
                                                NormCoreHours,
                                                ProjectMaxPrice,
                                                ProjectStatus,
                                                LinkedOrganization
                                            }) => (
                                                <tr key={ProjectID}>
                                                    <td className="text-left">
                                                        {checkFineReadPerms(ProjectID, 'prj', perms) ? <button
                                                            type="button"
                                                            className="btn btn-link"
                                                            onClick={() =>
                                                                gotoRoute(
                                                                    ROUTE_PROJECT_DETAIL,
                                                                    {
                                                                        id: ProjectID,
                                                                    }
                                                                )
                                                            }>
                                                            {ProjectName}
                                                        </button> : 
                                                            <button
                                                                type="button"
                                                                className="btn btn-link"
                                                                disabled
                                                            >
                                                                {ProjectName}
                                                            </button>
                                                        }
                                                    </td>
                                                    <td>{ organizations[LinkedOrganization] ? organizations[LinkedOrganization].FormalName : (<pre>{LinkedOrganization}</pre>)}</td>
                                                    <td className="text-right">
                                                        {NormCoreHours}
                                                    </td>
                                                    <td className="text-right">
                                                        {ProjectMaxPrice}
                                                    </td>
                                                    <td className="text-center">
                                                        {ProjectStatus}
                                                    </td>
                                                    <td className="text-center">
                                                        {checkFineReadPerms(ProjectID, 'prj', perms) ? <button
                                                            type="button"
                                                            className="btn btn-link"
                                                            onClick={() =>
                                                                gotoRoute(
                                                                    ROUTE_PROJECT_USAGE,
                                                                    {
                                                                        id: ProjectID,
                                                                    }
                                                                )
                                                            }>
                                                            View Usage
                                                        </button>
                                                            : '-' 
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
)

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

const mapStateToProps = state => ({
    projects: getProjects(state),
    listFetchInProgress: getFetchingStateOfProjects(state),
    userRole: getUserRole(state),
    perms: getUserFinePerms(state),
    organizations: getOrganizations(state)
})

export const ProjectList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectListImplementation)
