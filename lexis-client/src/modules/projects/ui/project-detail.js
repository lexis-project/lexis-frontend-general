import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"

import { getProjectDetail, getProjectUsers } from "../projects-selectors"
import {
    getUsageAccountsSum,
    checkEmptyHPCProjects,
    checkEmptyUsages,
    getUsageAccountInfo
} from "../accounting-resources-requests/accounting-resources-requests-selectors"
import { getUserCreatedByEmail } from "../../users/users-selectors"
import {
    ROUTE_PROJECT_EDIT,
    ROUTE_PROJECT_USERS_MANAGEMENT,
    ROUTE_PROJECT_RESOURCE_CREATEAPPROVED,
    // ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL,
} from "../../routing/routes"
import { PieChart } from "./project-detail-piechart/pie-chart"

import { loadStringOrLoading } from "../../utils"
import { HPCResourcesList as HPCResourcesListUserOrg } from "../resources/ui/list-hpc-resources"
import {
    getFetchingStateOfHPCResources,
    getHPCResourcesList,
} from "../resources/list-hpc-resources-selectors"
import {
    CheckFineReadPermsComp,
    CheckFineWritePermsComp,
    CheckIAMReadPerms,
    CheckIAMListPerms
} from "../../auth/auth-check-fine-perms"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"
import ProjectUsersPerms from "./project-users-perms"

/*
// helper class for aggregating norm. core  & budget from resources requests
export class Aggregate {
    constructor(resourcesRequestsFiltered) {
        this.resourcesRequestsFiltered = resourcesRequestsFiltered
    }

    get coreHours() {
        return this.calcCoreHours()
    }

    calcCoreHours() {
        return this.resourcesRequestsFiltered.reduce((acc, currentVal) => {
            if (
                typeof currentVal.HPCResourceRequestID === "number" &&
                currentVal.ApprovalStatus === "APPROVED"
            ) {
                return acc + currentVal.CoreHoursExpected
            } else {
                return acc + 0
            }
        }, 0)
    }
}
*/

// date and/or time formatting helper class
export class DateToTransform {
    constructor(date, format) {
        this.date = typeof date === "number" ? date : Date.parse(date)
        this.format = format
    }

    convert() {
        if (!Number.isNaN(this.date) && this.format === "date") {
            return new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            }).format(this.date)
        }
        if (!Number.isNaN(this.date) && this.format === "datetime") {
            return new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            }).format(this.date)
        }
        if (!this.format || !this.date) {
            return null
        }
    }
}
export const ProjectDetailImplementation = ({
    project,
    gotoRoute,
    listFetchInProgress,
    availableVsSpentCoreHours,
    isNotHPCProjectsEmpty,
    isNotUsagesEmpty,
    resourcesDataHPCList,
    createdByEmail,
    projUsers,
    availableCoreHours,
    organizations,
    usageAccountInfoHpcPrjs
}) => {
    return (<Fragment>
        <div className="row">
            <div className="col-8">
                <h1>
                    Project:{" "}
                    <em>{loadStringOrLoading(project, "ProjectName")}</em>
                </h1>
            </div>
            <div className="col-4" style={{ textAlign: "right" }}>
                {project && (
                    <>
                        <CheckFineWritePermsComp
                            type="prj"
                            prjID={project.ProjectID}>
                            <button
                                type="button"
                                className="btn btn-info btn-simple text-nowrap"
                                onClick={() =>
                                    gotoRoute(ROUTE_PROJECT_EDIT, {
                                        id: loadStringOrLoading(
                                            project,
                                            "ProjectID"
                                        ),
                                    })
                                }
                                cy="project-btn-update-existing">
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-settings"></i>
                                </span>{" "}
                                    Edit project info
                            </button>
                        </CheckFineWritePermsComp>
                        <CheckIAMReadPerms orgID={project.LinkedOrganization}>
                            <button
                                type="button"
                                className="btn btn-info btn-simple text-nowrap"
                                onClick={() =>
                                    gotoRoute(ROUTE_PROJECT_USERS_MANAGEMENT, {
                                        id: loadStringOrLoading(
                                            project,
                                            "ProjectID"
                                        ),
                                    })
                                }
                                cy="project-btn-user-management">
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-single-02"></i>
                                </span>{" "}
                                Manage users
                            </button>
                        </CheckIAMReadPerms>
                    </>
                )}
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header"></div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-8">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <p>ID of the Project:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                <code>
                                                    {loadStringOrLoading(
                                                        project,
                                                        "ProjectID"
                                                    )}
                                                </code>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Project Shortname:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                <code>
                                                    {loadStringOrLoading(
                                                        project,
                                                        "ProjectShortName"
                                                    )}
                                                </code>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Organization:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {project ? (organizations[project.LinkedOrganization] ?
                                                    organizations[project.LinkedOrganization].FormalName:
                                                    project.LinkedOrganization)
                                                    : '-'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Status:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                <em>
                                                    {loadStringOrLoading(
                                                        project,
                                                        "ProjectStatus"
                                                    )}
                                                </em>
                                            </p>
                                        </div>
                                    </div> 
                                    <div className="row">
                                        <div className="col-4">
                                            <p>
                                                Project contact person (email):
                                            </p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                <a
                                                    href={
                                                        "mailto:" +
                                                            loadStringOrLoading(
                                                                project,
                                                                "ProjectContactEmail"
                                                            )
                                                    }>
                                                    {loadStringOrLoading(
                                                        project,
                                                        "ProjectContactEmail"
                                                    )}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Norm. core hours:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {loadStringOrLoading(
                                                    project,
                                                    "NormCoreHours"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Max price (euro):</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {loadStringOrLoading(
                                                    project,
                                                    "ProjectMaxPrice"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {createdByEmail && <div className="row">
                                        <div className="col-4">
                                            <p>Created by:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                <a
                                                    href={
                                                        "mailto:" +
                                                            loadStringOrLoading(
                                                                { ProjectCreatedBy: createdByEmail },
                                                                "ProjectCreatedBy"
                                                            )
                                                    }>
                                                    {loadStringOrLoading(
                                                        { ProjectCreatedBy: createdByEmail },
                                                        "ProjectCreatedBy"
                                                    )}
                                                </a>
                                            </p>
                                        </div>
                                    </div>}
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Created at:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {new DateToTransform(
                                                    loadStringOrLoading(
                                                        project,
                                                        "ProjectCreationTime"
                                                    ),
                                                    "datetime"
                                                ).convert()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Start:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {new DateToTransform(
                                                    loadStringOrLoading(
                                                        project,
                                                        "ProjectStartDate"
                                                    ),
                                                    "date"
                                                ).convert()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Termination:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {new DateToTransform(
                                                    loadStringOrLoading(
                                                        project,
                                                        "ProjectTerminationDate"
                                                    ),
                                                    "date"
                                                ).convert()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <p>Domain:</p>
                                        </div>
                                        <div className="col">
                                            <p>
                                                {loadStringOrLoading(
                                                    project,
                                                    "ProjectDomain"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <CheckIAMListPerms>
                                        <>
                                            <div className="row mt-3">
                                                <div className="col-4">
                                                    <h3>Users:</h3>
                                                </div>
                                                <div className="col-8">
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-striped table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>Fullname</th>
                                                                    <th>Email</th>
                                                                    <th>Dat access</th>
                                                                    <th>Dat creation</th>
                                                                    <th>Dat pub. creation</th>
                                                                    <th>Prj mgr</th>
                                                                    <th>WF mgr</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {projUsers.length === 0 ?
                                                                    (<tr>
                                                                        <td colSpan="2" className="text-center">No user assigned to project</td>
                                                                    </tr>)
                                                                    : projUsers
                                                                        .map(user =>
                                                                            (<tr key={user.ID}>
                                                                                <td>{user.FirstName + " " + user.LastName}</td>
                                                                                <td>{user.EmailAddress}</td>
                                                                                <ProjectUsersPerms usrId={user.ID} prjId={project.ProjectID} /> 
                                                                            </tr>)    
                                                                        )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </CheckIAMListPerms>
                                        
                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <h3>Description:</h3>
                                        </div>
                                        <div className="col-8">
                                        </div>
                                        <div className="col-12">
                                            <p>
                                                {loadStringOrLoading(
                                                    project,
                                                    "ProjectDescription"
                                                )}
                                            </p>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                            {availableCoreHours === 0 // FIXME temporary solution until usage is available
                                ?
                                <div className="col-4">
                                </div>
                                :
                                <div className="col-4">
                                    {isNotHPCProjectsEmpty && isNotUsagesEmpty ? (
                                        <p className="ml-5">
                                            Available/spent core hours:
                                        </p>
                                    ) : null}
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
                                        <PieChart
                                            id={loadStringOrLoading(
                                                project,
                                                "ProjectID"
                                            )}
                                            data={availableVsSpentCoreHours}
                                            showChart={
                                                isNotHPCProjectsEmpty &&
                                                isNotUsagesEmpty
                                            }></PieChart>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
        <div className="row mt-4">
            <div className="col-3">
                <h3>Resources:</h3>
            </div>
            <div className="col-9" style={{ textAlign: "right" }}>
                {project && <CheckFineWritePermsComp
                    type="prj"
                    prjID={project.ProjectID}
                >
                    <button
                        type="button"
                        className="btn btn-success btn-simple text-nowrap ml-1"
                        onClick={() =>
                            gotoRoute(ROUTE_PROJECT_RESOURCE_CREATEAPPROVED, {
                                id: project.ProjectID,
                            })
                        }
                        cy="resource-approved-btn-addapproved">
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
                        Add resources (approved)
                    </button>
                </CheckFineWritePermsComp>}
            </div>
        </div>

        {project && (
            <CheckFineReadPermsComp type="prj" prjID={project.ProjectID}>
                <HPCResourcesListUserOrg resourcesDataHPCList={resourcesDataHPCList} usageAccountInfoHpcPrjs={usageAccountInfoHpcPrjs} />
            </CheckFineReadPermsComp>
        )}
    </Fragment>
    )
}

const mapStateToProps = state => {
    // const availableCoreHours = new Aggregate(
    //     getProjectsHPCResourcesRequestsFiltered(state)
    // ).coreHours

    const project = getProjectDetail(state)

    const isNotHPCProjectsEmpty = checkEmptyHPCProjects(state)
    const isNotUsagesEmpty = !!checkEmptyUsages(state)

    const spentCoreHours =
        isNotHPCProjectsEmpty && isNotUsagesEmpty
            ? getUsageAccountsSum(state)
            : 0
    const availableCoreHours = project ? project.NormCoreHours : '-'

    const usageAccountInfo = getUsageAccountInfo(state)
    const usageAccountInfoHpcPrjs = usageAccountInfo && usageAccountInfo.HPCProjects

    return {
        project: project,
        listFetchInProgress: getFetchingStateOfHPCResources(state),
        isNotHPCProjectsEmpty: isNotHPCProjectsEmpty,
        isNotUsagesEmpty: isNotUsagesEmpty,
        availableVsSpentCoreHours: [
            {
                name: "Available",
                value: availableCoreHours - spentCoreHours,
            },
            {
                name: "Spent",
                value: spentCoreHours,
            },
        ],
        availableCoreHours: availableCoreHours,
        resourcesDataHPCList: getHPCResourcesList(state),
        usageAccountInfoHpcPrjs: usageAccountInfoHpcPrjs,
        createdByEmail: getUserCreatedByEmail(state),
        projUsers: getProjectUsers(state),
        organizations: getOrganizations(state)
    }
}

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

export const ProjectDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectDetailImplementation)
