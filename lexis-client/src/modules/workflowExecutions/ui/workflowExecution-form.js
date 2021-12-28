import React from "react"
import cx from "classnames"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"
import { reduxForm } from "redux-form"

import {
    getWorkflowsDetailId,
    getWorkflowsDetail,
    isWFTasksThere,
    isPreprocessingTasksThere,
    isComputationTasksThere,
    isPostprocessingTasksThere,
    isVisualizationTasksThere,
} from "../../workflows/workflows-selectors.js"
import { ReduxFormCheckboxField } from "../../forms/checkbox-field"
import { InputFields } from "../workflowExecutions-inputs"
import { getProjects } from "../../projects/projects-selectors"
import { getCreatingState } from "../workflowExecutions-selectors"
import { getDataSets } from "../../data-sets/data-sets-selectors"

const goBack = () => window.history.back()

let WorkflowExecutionFormImpl = ({
    handleSubmit,
    onFormSubmit,
    submitting,
    initialValues,
    domainsPossible,
    form,
    error,
    gotoRoute,
    workflowId,
    workflow,
    projects,
    datasets,
    inputParams,
    createInProgress,
    isWFTasksThere,
    isPreprocessingTasksThere,
    isComputationTasksThere,
    isPostprocessingTasksThere,
    isVisualizationTasksThere,
}) =>
    workflow ? (
        <div className="row">
            <div className="col-9">
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className={cx({
                        "workflow-form": true,
                    })}>
                    {!isWFTasksThere ? (
                        <div className="card">
                            <div className="card-header">
                                No Inputs Required
                            </div>
                            <div className="card-body" />
                        </div>
                    ) : (
                        <InputFields
                            isPreprocessing={isPreprocessingTasksThere}
                            isComputation={isComputationTasksThere}
                            isPostprocessing={isPostprocessingTasksThere}
                            isVisualization={isVisualizationTasksThere}
                            workflow={workflow}
                            datasets={datasets}
                            formName={form}
                        />
                    )}
                    <ReduxFormCheckboxField
                        name="WorkflowExecutionConsent"
                        label="Please confirm you would like to Create & Run Workflow Execution with above Inputs"
                        required={true}
                        cy="project-form-termsconsent"
                    />
                    <button
                        className="btn btn-success btn-simple text-nowrap mr-1"
                        type="submit"
                        disabled={createInProgress}>
                        <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-simple-add"></i>
                        </span>{" "}
                        {createInProgress ? "Creating..." : "Run"}
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
    ) : (
        <div className="row">
            <div className="col-12 text-center">
                <div
                    className="spinner-border text-light ml-2"
                    role="status"
                    style={{ marginTop: "20vh" }}></div>
            </div>
        </div>
    )

const mapStateToProps = state => {
    return {
        workflowId: getWorkflowsDetailId(state),
        workflow: getWorkflowsDetail(state),
        projects: getProjects(state),
        createInProgress: getCreatingState(state),
        isWFTasksThere: isWFTasksThere(state),
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

WorkflowExecutionFormImpl = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowExecutionFormImpl)

export const WorkflowExecutionForm = reduxForm({
    form: "workflowExecution-form",
    // enableReinitialize: true,
})(WorkflowExecutionFormImpl)
