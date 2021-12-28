import React, { Fragment } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import Actions from "../workflowTemplates-actions"

import { ROUTE_WORKFLOW_CREATE } from "../../routing/routes"
import {
    getWorkflowTemplates,
    getUploadingState,
    getFetchingState,
} from "../workflowTemplates-selectors"
import { getRouteName } from "../../routing/routing-selectors"

import FragmentUpload from "./workflowTemplate-upload"

export const WorkflowTemplatesListImpl = ({
    workflowTemplates,
    gotoRoute,
    listFetchInProgress,
    uploadTemplate,
    uploadInProgress,
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1> Workflow Templates </h1>{" "}
            </div>{" "}
        </div>
        <div className="row">
            <div className="col-9">
                <FragmentUpload
                    form="workflow-template-upload"
                    onFormSubmit={uploadTemplate}
                    uploadInProgress={uploadInProgress}
                />{" "}
            </div>{" "}
        </div>
        <div className="row">
            <div className="col">
                <h4> Please select from the Workflow Templates below </h4>{" "}
            </div>{" "}
        </div>
        {listFetchInProgress ? (
            <div className="d-flex justify-content-center">
                <div
                    className="spinner-border text-light m-5"
                    role="status"
                    style={{
                        width: "3rem",
                        height: "3rem",
                    }}>
                    <span className="sr-only">Loading...</span>{" "}
                </div>{" "}
            </div>
        ) : (
            <>
                {" "}
                {workflowTemplates.map(
                    ({
                        workflowTemplateID,
                        workflowTemplateName,
                        description,
                    }) => (
                        <div key={workflowTemplateID} className="row">
                            <div className="col-9">
                                <div className="card">
                                    <div className="card-header">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-simple text-nowrap"
                                            onClick={() =>
                                                gotoRoute(
                                                    ROUTE_WORKFLOW_CREATE,
                                                    {
                                                        workflowTemplateId:
                                                            workflowTemplateID,
                                                    }
                                                )
                                            }>
                                            <span className="white d-inline-flex mx-1">
                                                <i className="tim-icons icon-simple-add">
                                                    {" "}
                                                </i>{" "}
                                            </span>{" "}
                                            {workflowTemplateName}{" "}
                                        </button>{" "}
                                    </div>{" "}
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-4">
                                                <p> Description: </p>{" "}
                                            </div>{" "}
                                            <div className="col">
                                                <p> {description} </p>{" "}
                                            </div>{" "}
                                        </div>{" "}
                                        <div className="row">
                                            <div className="col-4">
                                                <p> Workflow Template ID: </p>{" "}
                                            </div>{" "}
                                            <div className="col">
                                                <p> {workflowTemplateID} </p>{" "}
                                            </div>{" "}
                                        </div>{" "}
                                    </div>{" "}
                                </div>{" "}
                            </div>{" "}
                        </div>
                    )
                )}{" "}
            </>
        )}{" "}
    </Fragment>
)

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    uploadTemplate: Actions.Creators.upload,
}

const mapStateToProps = state => ({
    workflowTemplates: getWorkflowTemplates(state),
    listFetchInProgress: getFetchingState(state),
    uploadInProgress: getUploadingState(state),
    route: getRouteName(state),
})

export const WorkflowTemplatesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowTemplatesListImpl)
