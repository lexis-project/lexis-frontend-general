import React from "react"
import cx from "classnames"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"
import { reduxForm } from "redux-form"

import {
    getWorkflowTemplatesDetailId,
    isWFtemplateTasksThere,
    isPreprocessingTasksThere,
    isComputationTasksThere,
    isPostprocessingTasksThere,
    isVisualizationTasksThere,
} from "../../workflowTemplates/workflowTemplates-selectors.js"
import { ReduxFormInputField } from "../../forms/input-field"
import { ReduxFormSelectField } from "../../forms/select-field"
import { ReduxFormTextAreaField } from "../../forms/textarea-field"
import { getProjects } from "../../projects/projects-selectors"
import { getCreatingState } from "../workflows-selectors"
import { getDataSets } from "../../data-sets/data-sets-selectors"

const goBack = () => window.history.back()

const normalizeName = value => {
    var newStr = value.replace(/\s+/g, "")
    return newStr
}

let WorkflowFormImpl = ({
    handleSubmit,
    onFormSubmit,
    submitting,
    initialValues,
    domainsPossible,
    form,
    error,
    gotoRoute,
    workflowTemplateId,
    projects,
    datasets,
    inputParams,
    createInProgress,
    isWFtemplateTasksThere,
    isPreprocessingTasksThere,
    isComputationTasksThere,
    isPostprocessingTasksThere,
    isVisualizationTasksThere,
}) => (
    <div className="row">
        <div className="col-9">
            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className={cx({
                            "workflow-form": true,
                        })}>
                        <h4>Workflow Information</h4>
                        <ReduxFormInputField
                            name="workflowName"
                            type="text"
                            label="Name:"
                            required={true}
                            placeholder="Enter Workflow name"
                            normalize={normalizeName}
                        />
                        <ReduxFormSelectField
                            name="projectID"
                            label="Project ID:"
                            required={true}
                            displayNames={projects.map(a => a.ProjectName)}
                            values={projects.map(a => a.ProjectID)}
                        />
                        <ReduxFormTextAreaField
                            name="description"
                            label="Description"
                            placeholder="Please provide brief description"
                            required={true}
                        />
                        <button
                            className="btn btn-success btn-simple text-nowrap mr-1"
                            type="submit"
                            disabled={createInProgress}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                            {createInProgress ? "Creating..." : "Create"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-info btn-simple text-nowrap ml-1"
                            variant="outline-primary"
                            onClick={goBack}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-remove"></i>
                            </span>{" "}
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
)

const mapStateToProps = state => {
    return {
        workflowTemplateId: getWorkflowTemplatesDetailId(state),
        projects: getProjects(state),
        createInProgress: getCreatingState(state),
        isWFtemplateTasksThere: isWFtemplateTasksThere(state),
        isPreprocessingTasksThere: isPreprocessingTasksThere(state),
        isComputationTasksThere: isComputationTasksThere(state),
        isPostprocessingTasksThere: isPostprocessingTasksThere(state),
        isVisualizationTasksThere: isVisualizationTasksThere(state),
        datasets: getDataSets(state),
    }
}

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
}

WorkflowFormImpl = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowFormImpl)

export const WorkflowForm = reduxForm({
    form: "workflow-form",
    // enableReinitialize: true,
})(WorkflowFormImpl)
