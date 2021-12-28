import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import {
    ROUTE_WORKFLOWS_DETAIL,
    ROUTE_WORKFLOWTEMPLATES_LIST,
} from "../../routing/routes"
import {
    getWorkflows,
    getFetchingStateOfWorkflows,
} from "../workflows-selectors"
import { getRouteName } from "../../routing/routing-selectors"

import { CheckAnyProjWriteComp, CheckAnyWriteDatPerms, checkFineReadPerms } from "../../auth/auth-check-fine-perms"
import { getUserFinePerms } from "../../auth/auth-selectors"
import moment from "moment"

export const WorkflowsListImpl = ({
    workflows,
    gotoRoute,
    listFetchInProgress,
    perms,
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Workflows</h1>
            </div>
            <CheckAnyProjWriteComp>
                <CheckAnyWriteDatPerms>
                    <div className="col-4" style={{ textAlign: "right" }}>
                        <button
                            type="button"
                            className="btn btn-info btn-simple text-nowrap"
                            onClick={() => gotoRoute(ROUTE_WORKFLOWTEMPLATES_LIST)}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            Create new LEXIS Workflow
                        </button>
                    </div>
                </CheckAnyWriteDatPerms>
            </CheckAnyProjWriteComp>
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
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Workflow</th>
                                            <th>ID</th>
                                            <th>Project</th>
                                            <th>Creation Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workflows.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    No LEXIS Workflows found
                                                </td>
                                            </tr>
                                        )}
                                        {workflows.map(
                                            (
                                                {
                                                    workflowID,
                                                    workflowName,
                                                    projectID,
                                                    projectName,
                                                    creationTime,
                                                },
                                                index
                                            ) => (
                                                <tr key={index}>
                                                    <td className="text-left">
                                                        {checkFineReadPerms(
                                                            projectID,
                                                            "prj",
                                                            perms
                                                        ) ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link"
                                                                    onClick={() =>
                                                                        gotoRoute(
                                                                            ROUTE_WORKFLOWS_DETAIL,
                                                                            {
                                                                                workflowId:
                                                                                workflowID,
                                                                            }
                                                                        )
                                                                    }>
                                                                    {workflowName}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link"
                                                                    disabled>
                                                                    {workflowName}
                                                                </button>
                                                            )}
                                                    </td>
                                                    <td>{workflowID}</td>
                                                    <td>{projectName}</td>
                                                    <td>
                                                        {moment
                                                            .utc(creationTime)
                                                            .local()
                                                            .format(
                                                                "Do of MMM YYYY HH:mm:ss"
                                                            )}
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
    workflows: getWorkflows(state),
    listFetchInProgress: getFetchingStateOfWorkflows(state),
    route: getRouteName(state),
    perms: getUserFinePerms(state),
})

export const WorkflowsList = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowsListImpl)
