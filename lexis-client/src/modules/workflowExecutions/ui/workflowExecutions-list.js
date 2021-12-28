import React, { Fragment, useState } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import {
    ROUTE_WORKFLOWS_DETAIL,
    ROUTE_WORKFLOWEXECUTION_DETAIL,
} from "../../routing/routes"
import {
    getWorkflowsDetailId,
    getWorkflowsDetail,
} from "../../workflows/workflows-selectors"
import {
    getWorkflowExecutions,
    getFetchingStateOfWorkflowExecutions,
    getWorkflowExecutionLogs,
} from "../workflowExecutions-selectors"
import { getRouteName } from "../../routing/routing-selectors"
import moment from "moment"
import cx from "classnames"

export const WorkflowExecutionsListImpl = ({
    workflowExecutionLogs,
    workflowExecutions,
    workflow,
    workflowId,
    gotoRoute,
    listFetchInProgress,
}) => {
    const [getListSelection, setListSelection] = useState({ type: "general" })
    const getSelType = () => getListSelection.type
    const generalExecutions = workflowExecutions.filter(
        ({ workflowExecutionName }) => !workflowExecutionName.endsWith('_batch') 
        && !workflowExecutionName.endsWith('_scheduled')
    )
    const batchExecutions = workflowExecutions.filter(
        ({ workflowExecutionName }) => workflowExecutionName.endsWith('_batch')
    )
    const selectedWorkflowExecutions =
        getSelType() === "general" ? generalExecutions : batchExecutions
    return (
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>Workflow Executions</h1>
                </div>
                <div className="col-4" style={{ textAlign: "right" }}>
                    <button
                        type="button"
                        className="btn btn-info btn-simple"
                        onClick={() =>
                            gotoRoute(ROUTE_WORKFLOWS_DETAIL, {
                                workflowId,
                            })
                        }>
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-zoom-split"></i>
                        </span>{" "}
                        View Workflow Detail
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <ul
                                className="nav nav-tabs"
                                id="myTab"
                                role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={cx({
                                            "nav-link": true,
                                            active: getSelType() === "general",
                                        })}
                                        id="general-tab"
                                        data-bs-toggle="tab"
                                        type="button"
                                        role="tab"
                                        onClick={() =>
                                            setListSelection({
                                                type: "general",
                                            })
                                        }>
                                        General executions list
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={cx({
                                            "nav-link": true,
                                            active: getSelType() === "batch",
                                        })}
                                        id="batch-tab"
                                        data-bs-toggle="tab"
                                        type="button"
                                        role="tab"
                                        onClick={() =>
                                            setListSelection({ type: "batch" })
                                        }>
                                        Batch executions list
                                    </button>
                                </li>
                            </ul>

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
                                                <th>Workflow Execution</th>
                                                <th>Workflow</th>
                                                <th>Creation Time</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedWorkflowExecutions.length ===
                                                0 && (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        style={{
                                                            textAlign: "center",
                                                        }}>
                                                        No LEXIS Workflow
                                                        Executions found
                                                    </td>
                                                </tr>
                                            )}
                                            {selectedWorkflowExecutions.map(
                                                ({
                                                    workflowExecutionID,
                                                    workflowExecutionName,
                                                    creationTime,
                                                    workflowExecutionStatus,
                                                    workflowName,
                                                }) => (
                                                    <tr
                                                        key={
                                                            workflowExecutionID
                                                        }>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link"
                                                                onClick={() =>
                                                                    gotoRoute(
                                                                        ROUTE_WORKFLOWEXECUTION_DETAIL,
                                                                        {
                                                                            workflowId,
                                                                            workflowExecutionId:
                                                                                workflowExecutionID,
                                                                        }
                                                                    )
                                                                }>
                                                                {
                                                                    workflowExecutionName
                                                                }
                                                            </button>
                                                        </td>
                                                        <td>{workflowName}</td>
                                                        <td>
                                                            {moment
                                                                .utc(
                                                                    creationTime
                                                                )
                                                                .local()
                                                                .format(
                                                                    "Do of MMM YYYY HH:mm:ss"
                                                                )}
                                                        </td>
                                                        <td>
                                                            {
                                                                workflowExecutionStatus
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
}

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
}

const mapStateToProps = state => ({
    workflowExecutions: getWorkflowExecutions(state),
    listFetchInProgress: getFetchingStateOfWorkflowExecutions(state),
    workflowExecutionLogs: getWorkflowExecutionLogs(state),
    route: getRouteName(state),
    workflowId: getWorkflowsDetailId(state),
    workflow: getWorkflowsDetail(state),
})

export const WorkflowExecutionsList = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowExecutionsListImpl)
