import React from "react"
import { actions as routerActions } from "redux-router5"

// FIXME - temporary solution until there's ready approval system
// import { ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL } from "../../routing/routes"
import { connect } from "react-redux"
import { getProjectId } from "../projects-selectors"

const ResourcesListImpl = ({ projectId, gotoRoute, resourcesData }) => {
    return (
        <>
            <div className="row mt-4">
                <div className="col-3">
                    <h3>Resources:</h3>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table
                                    className="table table-striped table-bordered table-hover"
                                    cy="resourcesrequests-list-table">
                                    <thead>
                                        <tr>
                                            <th>Resource name</th>
                                            <th>Description</th>
                                            <th>Cost</th>
                                            <th>Core hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resourcesData &&
                                            resourcesData.length === 0 && (
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
                                        {resourcesData &&
                                            resourcesData.map(
                                                ({
                                                    resource_id,
                                                    resource_name,
                                                    description,
                                                    cost,
                                                    usage,
                                                }) => (
                                                    <tr
                                                        key={resource_id}
                                                        id={`resource-request-row-${resource_id}`}>
                                                        <td>
                                                            {/* FIXME - temporary solution until there's ready approval system */}
                                                            {/* <button
                                                                    type="button"
                                                                    className="btn btn-link"
                                                                    onClick={() =>
                                                                        gotoRoute(
                                                                            ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL,
                                                                            {
                                                                                id: projectId,
                                                                                resourceRequestId: resource_id,
                                                                            }
                                                                        )
                                                                    }> */}
                                                            {resource_name}
                                                            {/* </button> */}
                                                        </td>
                                                        <td>{description}</td>
                                                        <td className="text-right">
                                                            {cost}
                                                        </td>
                                                        <td className="text-right">
                                                            {usage}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        projectId: getProjectId(state),
    }
}

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

export const ResourcesListAccounting = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourcesListImpl)
