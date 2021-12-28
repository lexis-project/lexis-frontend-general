import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import Actions from "../workflows-actions"
import { WorkflowTaskList } from "../workflows-tasks"
import {
    getWorkflowsDetailId,
    getWorkflowsDetail,
    getRemovingState,
} from "../workflows-selectors"
import {
    ROUTE_WORKFLOWEXECUTIONS_LIST,
    ROUTE_WORKFLOWEXECUTION_CREATE,
    ROUTE_USERS_DETAIL,
} from "../../routing/routes"

import { getUserFinePerms } from "../../auth/auth-selectors"
import moment from "moment"
import { checkFineWritePerms } from "../../auth/auth-check-fine-perms"
import { getUsers } from "../../entity-repository/entity-repository-selectors"

const goBack = () => window.history.back()

const WorkflowsDetailImpl = ({
    workflow,
    workflowId,
    gotoRoute,
    remove,
    removeInProgress,
    perms,
    users,
}) =>
    workflow ? (
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>
                        Workflow: <em>{workflow.workflowName}</em>
                    </h1>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h4>Workflow Information</h4>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Workflow Name:</p>
                                </div>
                                <div className="col">
                                    <p>{workflow.workflowName}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Workflow ID:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <code>{workflow.workflowID}</code>
                                    </p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Project:</p>
                                </div>
                                <div className="col">
                                    <p>{workflow.projectName}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Workflow Template:</p>
                                </div>
                                <div className="col">
                                    <p>{workflow.workflowTemplateID}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Description:</p>
                                </div>
                                <div className="col">
                                    <p>{workflow.description}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Created By:</p>
                                </div>
                                <div className="col">
                                    <p>{users[workflow.createdBy] !== undefined? (<>
                                        {`${users[workflow.createdBy].FirstName} ${users[workflow.createdBy].LastName}`}
                                        <em>{`(${users[workflow.createdBy].EmailAddress})`}
                                        </em>
                                    </>)
                                        : workflow.createdBy}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <p>Time Created:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        {moment
                                            .utc(workflow.creationTime)
                                            .local()
                                            .format("Do of MMM YYYY HH:mm:ss")}
                                    </p>
                                </div>
                            </div>
                            <h4>Workflow Tasks</h4>
                            <WorkflowTaskList
                                templates={workflow.nodeTemplates}
                            />
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
                        {checkFineWritePerms(
                            workflow.projectID,
                            "prj",
                            perms
                        )&& checkFineWritePerms(
                            workflow.projectID,
                            "dat",
                            perms
                        )&& (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-success btn-simple text-nowrap mr-1"
                                    onClick={() =>
                                        gotoRoute(ROUTE_WORKFLOWEXECUTION_CREATE, {
                                            workflowId,
                                        })
                                    }>
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons icon-simple-add"></i>
                                    </span>{" "}
                                    Create Workflow Execution
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-info btn-simple text-nowrap"
                                    disabled={removeInProgress}
                                    onClick={() => {
                                        remove()
                                    }}>
                                    <span className="white d-inline-flex mx-1">
                                        <i className="tim-icons icon-trash-simple"></i>
                                    </span>{" "}
                                    {removeInProgress
                                        ? "Removing..."
                                        : "Remove Workflow"}
                                </button>
                            </>)
                        }
                        <button
                            type="button"
                            className="btn btn-success btn-simple text-nowrap ml-1"
                            onClick={() =>
                                gotoRoute(ROUTE_WORKFLOWEXECUTIONS_LIST, {
                                    workflowId,
                                })
                            }>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-zoom-split"></i>
                            </span>{" "}
                            View Workflow Executions
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    ) : (
        <button
            type="button"
            className="btn btn-success btn-link text-nowrap"
            onClick={goBack}>
            Back
        </button>
    )

const mapStateToProps = state => ({
    workflowId: getWorkflowsDetailId(state),
    workflow: getWorkflowsDetail(state),
    removeInProgress: getRemovingState(state),
    perms: getUserFinePerms(state),
    users: getUsers(state)
})

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    remove: Actions.Creators.remove,
}

export const WorkflowsDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowsDetailImpl)
