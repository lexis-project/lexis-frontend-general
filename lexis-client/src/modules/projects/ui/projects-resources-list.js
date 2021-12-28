import React from "react"
import { actions as routerActions } from "redux-router5"

import {
    ROUTE_PROJECT_RESOURCE_CREATEAPPROVED,
    ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC,
    ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL,
} from "../../routing/routes"
import { connect } from "react-redux"
import { getProjectId } from "../projects-selectors"
import {
    getProjectsHPCResourcesRequests,
    getFetchingStateOfResourcesRequests,
} from "../resources-requests-dynamic/resources-requests-selectors"
import AuthCheckPermission from "../../auth/auth-check-perms"
import { getUserRole } from "../../auth/auth-selectors"

const removeDuplicates = a => [...new Set(a)]

const ResourcesListImpl = ({
    projectId,
    resources,
    resourcesRequests,
    userRole,
    gotoRoute,
    listFetchInProgress,
}) => (
    <>
        <div className="row mt-4">
            <div className="col-3">
                <h3>Resources Requests:</h3>
            </div>

            <div className="col-9" style={{ textAlign: "right" }}>
                <AuthCheckPermission
                    permissionName="create-projects-resources"
                    userRole={userRole}>
                    <button
                        type="button"
                        className="btn btn-success btn-simple text-nowrap mr-1"
                        onClick={() =>
                            gotoRoute(ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC, {
                                id: projectId,
                            })
                        }
                        cy="resource-dynamic-btn-adddynamic">
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
                        Add resources (dynamic allocation)
                    </button>
                </AuthCheckPermission>
                <AuthCheckPermission
                    permissionName="create-projects-resources"
                    userRole={userRole}>
                    <button
                        type="button"
                        className="btn btn-success btn-simple text-nowrap ml-1"
                        onClick={() =>
                            gotoRoute(ROUTE_PROJECT_RESOURCE_CREATEAPPROVED, {
                                id: projectId,
                            })
                        }
                        cy="resource-approved-btn-addapproved">
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
                        Add resources (approved)
                    </button>
                </AuthCheckPermission>
            </div>
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
                                    cy="resourcesrequests-list-table">
                                    <thead>
                                        <tr>
                                            <th>Cluster(s)</th>
                                            <th>Status</th>
                                            <th>Queues IDs</th>
                                            <th>Norm. core hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resourcesRequests.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    Empty list of resources
                                                    requests
                                                </td>
                                            </tr>
                                        )}
                                        {resourcesRequests &&
                                            resourcesRequests.map(
                                                ({
                                                    HPCResourceRequestID,
                                                    ApprovalStatus,
                                                    Resources,
                                                    CoreHoursExpected,
                                                }) => (
                                                    <tr
                                                        key={
                                                            HPCResourceRequestID
                                                        }
                                                        id={`resource-request-row-${HPCResourceRequestID}`}>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link"
                                                                onClick={() =>
                                                                    gotoRoute(
                                                                        ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL,
                                                                        {
                                                                            id: projectId,
                                                                            resourceRequestId: HPCResourceRequestID,
                                                                        }
                                                                    )
                                                                }>
                                                                {removeDuplicates(
                                                                    Resources.reduce(
                                                                        (
                                                                            acc,
                                                                            currentVal
                                                                        ) =>
                                                                            acc.concat(
                                                                                currentVal.ClusterName
                                                                            ),
                                                                        []
                                                                    )
                                                                ).join(", ")}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {ApprovalStatus}
                                                        </td>
                                                        <td className="text-right">
                                                            {Resources.reduce(
                                                                (
                                                                    acc,
                                                                    currentVal
                                                                ) =>
                                                                    acc.concat(
                                                                        currentVal.QueueId
                                                                    ),
                                                                []
                                                            ).join(", ")}
                                                        </td>
                                                        <td className="text-right">
                                                            {CoreHoursExpected}
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
    </>
)

const mapStateToProps = state => {
    // FIXME
    // const resources = getProjectsHPCResources(state).filter(el => el.AssociatedLEXISProject === projectId)

    return {
        // resources: resources,
        resourcesRequests: getProjectsHPCResourcesRequests(state),
        projectId: getProjectId(state),
        userRole: getUserRole(state),
        listFetchInProgress: getFetchingStateOfResourcesRequests(state),
    }
}

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

export const ResourcesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourcesListImpl)
