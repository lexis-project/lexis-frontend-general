import React, { useState } from "react"
import { connect } from "react-redux"
import { formValues, getFormValues, reduxForm } from "redux-form"
import { ReduxFormInputField } from "../../../forms/input-field"
import { downloadCSVTemplate } from "../../workflowExecutions-batch"
import { isInvalid } from "redux-form"
import workflowExecutionsActions from "../../workflowExecutions-actions"
import { getWorkflowsDetail } from "../../../workflows/workflows-selectors"
import {
    getBatchErrors,
    getBatchStatus,
    getCreatingState,
} from "../../workflowExecutions-selectors"
import { actions as routerActions } from "redux-router5"
import { ROUTE_WORKFLOWEXECUTIONS_LIST } from "../../../routing/routes"

const checkFileSelected = values =>
    values && values.csvFile && values.csvFile.length > 0

const executionText = (done, fetchInProgress) => {
    if (fetchInProgress && done !== true) {
        if (done === null) {
            return "Preparing executions..."
        } else {
            return `Requesting executions...`
        }
    } else {
        if (done === null) {
            return `Run Executions`
        } else {
            return "Done"
        }
    }
}

const BatchFormImpl = ({
    createInProgress,
    handleSubmit,
    fValues,
    execErrors,
    executeBatch,
    workflow,
    batchStatus,
    gotoRoute,
}) => {
    return (
        <form name="batch-wf-exec" onSubmit={handleSubmit(executeBatch)}>
            <div className="row mt-1 mb-1">
                <div className="col-9 ">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-9">
                                    <ReduxFormInputField
                                        type="file"
                                        label="Select CSV for batch execution"
                                        required={true}
                                        name="csvFile"
                                        cy="csv-select-batch-file"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button
                                        className="btn btn-success btn-simple text-nowrap mt-3 ml-2 mr-1"
                                        type="submit"
                                        disabled={
                                            !checkFileSelected(fValues) ||
                                            createInProgress ||
                                            (!createInProgress &&
                                                batchStatus.done !== null)
                                        }>
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-simple-add"></i>
                                        </span>{" "}
                                        {executionText(
                                            batchStatus.done,
                                            createInProgress
                                        )}
                                    </button>
                                    {!createInProgress &&
                                        batchStatus.done === true && (
                                        <>
                                            <div
                                                className="alert alert-success mt-2 mb-2 mr-1 ml-1"
                                                role="alert">
                                                    All executions requested!
                                            </div>
                                            <button
                                                className="btn btn-sm btn-success btn-simple text-nowrap mr-1 pt-2 pb-2 px-4"
                                                onClick={() =>
                                                    gotoRoute(
                                                        ROUTE_WORKFLOWEXECUTIONS_LIST,
                                                        {
                                                            workflowId:
                                                                    workflow.workflowID,
                                                        }
                                                    )
                                                }
                                                type="button">
                                                    Go to Workflow Executions
                                                    List
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="col-6 text-right">
                                    <button
                                        className="btn btn-sm btn-outline-secondary text-nowrap mr-1 pt-2 pb-2 px-4"
                                        onClick={() =>
                                            downloadCSVTemplate(
                                                workflow.workflowName,
                                                workflow.inputParameters
                                            )
                                        }
                                        type="button">
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-cloud-download-93"></i>
                                        </span>{" "}
                                        Download batch CSV template
                                    </button>
                                </div>
                            </div>
                            {execErrors && (
                                <div className="row">
                                    <div
                                        className="col-12"
                                        id="batch_exec_errors">
                                        {execErrors.map((e, i) => (
                                            <div
                                                className="alert alert-warning mt-2 mb-2 mr-1 ml-1"
                                                role="alert"
                                                key={i}>
                                                {e}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

const mapStateToProps = state => ({
    createInProgress: getCreatingState(state),
    workflow: getWorkflowsDetail(state),
    isInValid: isInvalid("batch-wf-exec")(state),
    fValues: getFormValues("batch-wf-exec")(state),
    execErrors: getBatchErrors(state),
    batchStatus: getBatchStatus(state),
})

const mapDispatchToProps = {
    executeBatch: workflowExecutionsActions.Creators.executeBatch,
    gotoRoute: routerActions.navigateTo,
}

export default reduxForm({
    form: "batch-wf-exec", // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: false, // <------ unregister fields on unmount
    validate: checkFileSelected,
})(connect(mapStateToProps, mapDispatchToProps)(BatchFormImpl))
