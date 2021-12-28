import React from "react"
import { actions as routerActions } from "redux-router5"
import { connect } from "react-redux"

import { ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL } from "../../routing/routes"
import { getProjectId } from "../projects-selectors"
import {
    getProjectsHPCApprovedResourcesRequests,
    getFetchingStateOfApprovedResourcesRequests,
} from "../resources-requests-approved/resources-requests-selectors"
import { getUserRole } from "../../auth/auth-selectors"

const ApprovedResourcesListImpl = ({
    projectId,
    resourcesRequests,
    gotoRoute,
    listFetchInProgress,
}) => (
    <>
        <div className="row mt-4">
            <div className="col-3">
                <h3>Approved Resources Requests:</h3>
            </div>
            <div className="col-9" />
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
                                    cy="approved-resourcesrequests-list-table">
                                    <thead>
                                        <tr>
                                            <th>HPC Center</th>
                                            <th>Status</th>
                                            <th>HPC Project ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resourcesRequests.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    Empty list of approved
                                                    resources requests
                                                </td>
                                            </tr>
                                        )}
                                        {resourcesRequests &&
                                            resourcesRequests.map(
                                                ({
                                                    HPCResourceID,
                                                    HPCProvider,
                                                    ApprovalStatus,
                                                    HPCProjectID,
                                                }) => (
                                                    <tr
                                                        key={HPCResourceID}
                                                        id={`approved-resource-request-row-${HPCResourceID}`}>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link"
                                                                onClick={() =>
                                                                    gotoRoute(
                                                                        ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL,
                                                                        {
                                                                            id: projectId,
                                                                            resourceRequestId: HPCResourceID,
                                                                        }
                                                                    )
                                                                }>
                                                                {HPCProvider}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {ApprovalStatus}
                                                        </td>
                                                        <td>
                                                            <code>
                                                                {HPCProjectID}
                                                            </code>
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

const mapStateToProps = state => ({
    resourcesRequests: getProjectsHPCApprovedResourcesRequests(state),
    projectId: getProjectId(state),
    userRole: getUserRole(state),
    listFetchInProgress: getFetchingStateOfApprovedResourcesRequests(state),
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

export const ApprovedResourcesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApprovedResourcesListImpl)
