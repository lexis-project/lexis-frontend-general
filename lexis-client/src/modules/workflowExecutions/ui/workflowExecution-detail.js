import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import Actions from "../workflowExecutions-actions"
import {
    getWorkflowExecutionDetailId,
    getWorkflowExecutionDetail,
    getWorkflowExecutionLogs,
    getWorkflowExecutionStepStatus,
    getDeletingState,
    getFetchingStateOfWorkflowExecution,
    getFetchingStateOfWorkflowExecutionStepStatuses,
    getFetchingStateOfWorkflowExecutionLogs,
} from "../workflowExecutions-selectors"
import {
    getWorkflowsDetailId,
    getWorkflowsDetail,
} from "../../workflows/workflows-selectors"
import { WorkflowTaskList } from "../../workflows/workflows-tasks"
import { WorkflowExecutionDiagram } from "./workflowExecutions-diagram.js"
import {
    ROUTE_DATA_SETS_DETAIL,
    ROUTE_WORKFLOWEXECUTION_CREATE,
} from "../../routing/routes"

import moment from "moment"
import { CheckFineWritePermsComp } from "../../auth/auth-check-fine-perms"

const goBack = () => window.history.back()

const getInternalIDfromPath = ddi_path => {
    var newStr = ddi_path.split("/")
    if (newStr[newStr.length - 1].split(".")[2] === "gz") {
        return newStr[newStr.length - 2]
    } else {
        return newStr[newStr.length - 1]
    }
}

function parseParameterValuesMap(inputParameters) {
    var paramValuesMap = {}
    if (inputParameters !== undefined && inputParameters !== null) {
        inputParameters.forEach(inputParameter => {
            if (inputParameter.inputParamValue !== undefined) {
                paramValuesMap[inputParameter.inputParamName] =
                    inputParameter.inputParamValue
            }
        })
    }
    return paramValuesMap
}

const WorkflowExecutionDetailImpl = ({
    workflowExecutionStepStatus,
    workflowExecutionLogs,
    workflowExecution,
    workflowExecutionId,
    workflow,
    wfeFetchInProgress,
    statusFetchInProgress,
    logsFetchInProgress,
    gotoRoute,
    cancel,
    deleteInProgress,
    delete_execution,
}) => (
    <Fragment>
        {workflowExecution && workflow ? (
            <>
                <div className="row">
                    <div className="col-9">
                        <h1>
                            Workflow Execution:{" "}
                            {workflowExecution.workflowExecutionName}
                        </h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"></div>
                            <div className="card-body">
                                <div>
                                    <ul
                                        className="nav nav nav-pills nav-fill"
                                        id="wfExecution"
                                        role="tablist">
                                        <li
                                            className="nav-item"
                                            role="presentation">
                                            <a
                                                className="nav-link active"
                                                id="detail-tab"
                                                data-toggle="tab"
                                                href="#detail"
                                                role="tab"
                                                aria-controls="detail"
                                                aria-selected="true">
                                                Detail
                                            </a>
                                        </li>
                                        <li
                                            className="nav-item"
                                            role="presentation">
                                            <a
                                                className="nav-link"
                                                id="taskStatus-tab"
                                                data-toggle="tab"
                                                href="#taskStatus"
                                                role="tab"
                                                aria-controls="taskStatus"
                                                aria-selected="false">
                                                Progress
                                            </a>
                                        </li>
                                        <li
                                            className="nav-item"
                                            role="presentation">
                                            <a
                                                className="nav-link"
                                                id="logs-tab"
                                                data-toggle="tab"
                                                href="#logs"
                                                role="tab"
                                                aria-controls="logs"
                                                aria-selected="false">
                                                Logs
                                            </a>
                                        </li>
                                    </ul>

                                    <div
                                        className="tab-content mt-4"
                                        id="wfExecutionContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="detail"
                                            role="tabpanel"
                                            aria-labelledby="detail-tab">
                                            <h4>Workflow Information</h4>
                                            <div className="row align-items-center">
                                                <div className="col-4">
                                                    <p>Workflow:</p>
                                                </div>
                                                <div className="col">
                                                    <p>
                                                        {workflow.workflowName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-4">
                                                    <p>Project:</p>
                                                </div>
                                                <div className="col">
                                                    <p>
                                                        {workflow.projectName}
                                                    </p>
                                                </div>
                                            </div>
                                            <h4>
                                                Workflow Execution Information
                                            </h4>
                                            {wfeFetchInProgress ? (
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
                                                <>
                                                    <div className="row detail-workflowExecution">
                                                        <div className="col-4">
                                                            <p>
                                                                Workflow
                                                                Execution:
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <p>
                                                                {
                                                                    workflowExecution.workflowExecutionName
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="row detail-workflowExecution">
                                                        <div className="col-4">
                                                            <p>
                                                                Workflow
                                                                Execution ID:
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <p>
                                                                <code>
                                                                    {
                                                                        workflowExecutionId
                                                                    }
                                                                </code>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="row detail-workflowExecution">
                                                        <div className="col-4">
                                                            <p>Created By:</p>
                                                        </div>
                                                        <div className="col">
                                                            <p>
                                                                {
                                                                    workflowExecution.createdBy
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="row detail-workflowExecution">
                                                        <div className="col-4">
                                                            <p>Time Created:</p>
                                                        </div>
                                                        <div className="col">
                                                            <p>
                                                                {moment
                                                                    .utc(
                                                                        workflowExecution.creationTime
                                                                    )
                                                                    .local()
                                                                    .format(
                                                                        "Do of MMM YYYY HH:mm:ss"
                                                                    )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="row detail-workflowExecution">
                                                        <div className="col-4">
                                                            <p>Status:</p>
                                                        </div>
                                                        <div className="col">
                                                            <p>
                                                                {
                                                                    workflowExecution.workflowExecutionStatus
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <h4>
                                                        Workflow Execution
                                                        Inputs
                                                    </h4>
                                                    {workflowExecution.inputParameters !==
                                                        undefined &&
                                                    workflowExecution.inputParameters !==
                                                        null ? (
                                                            workflowExecution.inputParameters.map(
                                                                (item, index) => (
                                                                    <div
                                                                        key={index}>
                                                                        {Array.isArray(
                                                                            item.inputParamValue
                                                                        ) ? (
                                                                                item.inputParamValue.map(
                                                                                    (
                                                                                        subItem,
                                                                                        subIndex
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                subIndex
                                                                                            }>
                                                                                            <div className="row">
                                                                                                <div className="col-4">
                                                                                                    {subIndex <
                                                                                            1
                                                                                                        ? item.inputParamName
                                                                                                        : null}
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    {" "}
                                                                                                    {
                                                                                                        subItem
                                                                                                    }{" "}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )
                                                                            ) : (
                                                                                <div className="row align-items-center">
                                                                                    <div className="col-4">
                                                                                        {
                                                                                            item.inputParamName
                                                                                        }

                                                                                :
                                                                                    </div>
                                                                                    <div className="col-4">
                                                                                        {item.inputParamType ===
                                                                                "boolean"
                                                                                            ? item.inputParamValue.toString()
                                                                                            : item.inputParamValue}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <div className="row align-items-center">
                                                                <div className="col-4">
                                                                No Inputs
                                                                defined for
                                                                workflow
                                                                execution
                                                                </div>
                                                            </div>
                                                        )}
                                                    <h4>Workflow Tasks</h4>
                                                    <WorkflowTaskList
                                                        templates={
                                                            workflowExecution.nodeTemplates
                                                        }
                                                    />
                                                    <h4>Output Properties</h4>
                                                    {workflowExecution.outputProperties !=
                                                    null ? (
                                                            workflowExecution.outputProperties.map(
                                                                (
                                                                    outputProp,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        className="detail-workflowExecution"
                                                                        key={index}>
                                                                        {outputProp.attributeName ===
                                                                    "url" ? (
                                                                                <div className="row align-items-center">
                                                                                    <div className="col-4">
                                                                                        <p>
                                                                                            {
                                                                                                outputProp.nodeName
                                                                                            }

                                                                                    :
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="col-4">
                                                                                        <a
                                                                                            href={
                                                                                                outputProp.attributeValue
                                                                                            }
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer">
                                                                                            {
                                                                                                outputProp.attributeValue
                                                                                            }
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="detail-workflowExecution">
                                                                                    {outputProp.attributeName ===
                                                                            "destination_path" ? (
                                                                                            <div className="row align-items-center">
                                                                                                <div className="col-4">
                                                                                                    <p>
                                                                                                        {
                                                                                                            outputProp.nodeName
                                                                                                        }

                                                                                            :
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="btn btn-link"
                                                                                                        onClick={() =>
                                                                                                            gotoRoute(
                                                                                                                ROUTE_DATA_SETS_DETAIL,
                                                                                                                {
                                                                                                                    internalID:
                                                                                                            getInternalIDfromPath(
                                                                                                                outputProp.attributeValue
                                                                                                            ),
                                                                                                                }
                                                                                                            )
                                                                                                        }>
                                                                                                        {getInternalIDfromPath(
                                                                                                            outputProp.attributeValue
                                                                                                        )}
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="row align-items-center">
                                                                                                <div className="col-4">
                                                                                                    <p>
                                                                                                        {
                                                                                                            outputProp.nodeName
                                                                                                        }

                                                                                            :
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <p>
                                                                                                        {
                                                                                                            outputProp.attributeValue
                                                                                                        }
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <div className="row">
                                                                <div className="col">
                                                                    <p>
                                                                    Output
                                                                    Properties
                                                                    not ready
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                </>
                                            )}
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="taskStatus"
                                            role="tabpanel"
                                            aria-labelledby="taskStatus-tab">
                                            <h4>Workflow Execution Progress</h4>
                                            {statusFetchInProgress ? (
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
                                            ) : workflowExecutionStepStatus !==
                                                  null &&
                                              workflowExecutionStepStatus.length >
                                                  0 &&
                                              workflowExecution.workflowExecutionStatus !==
                                                  "Cancelled" ? (
                                                    <WorkflowExecutionDiagram
                                                        key={workflowExecutionId}
                                                        wfeid={workflowExecutionId}
                                                        wfesteps={
                                                            workflowExecutionStepStatus
                                                        }
                                                    />
                                                ) : (
                                                    <div className="row">
                                                        <div className="col-9">
                                                        Workflow Execution
                                                        Cancelled
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div
                                            className="tab-pane fade table-responsive"
                                            id="logs"
                                            role="tabpanel"
                                            aria-labelledby="logs-tab">
                                            <h4>Logs</h4>
                                            {logsFetchInProgress ? (
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
                                                            <th>Time</th>
                                                            <th>
                                                                Log message
                                                                content
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {workflowExecutionLogs.map(
                                                            (
                                                                {
                                                                    timestamp,
                                                                    content,
                                                                },
                                                                index
                                                            ) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {moment
                                                                            .utc(
                                                                                timestamp
                                                                            )
                                                                            .local()
                                                                            .format(
                                                                                "YYYY-MM-DD HH:mm:ss"
                                                                            )}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            content
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
                    </div>
                </div>

                <div className="row my-3">
                    <div className="col-10">
                        <div
                            className="btn-toolbar"
                            role="toolbar"
                            aria-label="Toolbar with button groups">
                            <CheckFineWritePermsComp
                                prjID={workflow.projectID}
                                type="prj"
                            >
                                <CheckFineWritePermsComp
                                    prjID={workflow.projectID}
                                    type="dat"
                                >
                                    {workflowExecution.workflowExecutionStatus ===
                                        "Running" && (
                                        <button
                                            type="button"
                                            className="btn btn-success btn-simple text-nowrap"
                                            onClick={() => {
                                                cancel()
                                            }}>
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-double-left"></i>
                                            </span>{" "}
                                            Cancel Workflow Execution
                                        </button>
                                    )}
                                </CheckFineWritePermsComp>
                            </CheckFineWritePermsComp>
                            <CheckFineWritePermsComp
                                prjID={workflow.projectID}
                                type="prj"
                            >
                                <CheckFineWritePermsComp
                                    prjID={workflow.projectID}
                                    type="dat"
                                >
                                    {workflowExecution.workflowExecutionStatus !==
                                        "Running" &&
                                        workflowExecution.workflowExecutionStatus !==
                                            "Cancelling" && (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-simple text-nowrap mx-1"
                                            disabled={deleteInProgress}
                                            onClick={() => {
                                                delete_execution()
                                            }}>
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-trash-simple"></i>
                                            </span>{" "}
                                            {deleteInProgress
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    )}
                                </CheckFineWritePermsComp>
                            </CheckFineWritePermsComp>
                            <div className="row">
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-link text-nowrap"
                                        onClick={goBack}>
                                        Back
                                    </button>
                                    <CheckFineWritePermsComp
                                        prjID={workflow.projectID}
                                        type="prj"
                                    >
                                        <CheckFineWritePermsComp
                                            prjID={workflow.projectID}
                                            type="dat"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-info btn-link text-nowrap"
                                                onClick={() =>
                                                    gotoRoute(
                                                        ROUTE_WORKFLOWEXECUTION_CREATE,
                                                        {
                                                            workflowId:
                                                                workflow.workflowID,
                                                            routedParameters:
                                                                workflowExecution.inputParameters
                                                                    ? parseParameterValuesMap(
                                                                        workflowExecution.inputParameters
                                                                    )
                                                                    : null,
                                                        }
                                                    )
                                                }>
                                                Recreate workflow
                                            </button>
                                        </CheckFineWritePermsComp>
                                    </CheckFineWritePermsComp>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="row">
                <div className="col-12 text-center">
                    <span
                        className="spinner-border text-light"
                        role="status"></span>
                    <h5>Loading...</h5>
                </div>
            </div>
        )}
    </Fragment>
)

const mapStateToProps = state => ({
    workflowExecutionLogs: getWorkflowExecutionLogs(state),
    workflowExecutionStepStatus: getWorkflowExecutionStepStatus(state),
    workflowExecution: getWorkflowExecutionDetail(state),
    workflowExecutionId: getWorkflowExecutionDetailId(state),
    workflowId: getWorkflowsDetailId(state),
    workflow: getWorkflowsDetail(state),
    wfeFetchInProgress: getFetchingStateOfWorkflowExecution(state),
    statusFetchInProgress:
        getFetchingStateOfWorkflowExecutionStepStatuses(state),
    logsFetchInProgress: getFetchingStateOfWorkflowExecutionStepStatuses(state),
    deleteInProgress: getDeletingState(state),
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    cancel: Actions.Creators.cancel,
    delete_execution: Actions.Creators.remove,
}

export const WorkflowExecutionDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowExecutionDetailImpl)
