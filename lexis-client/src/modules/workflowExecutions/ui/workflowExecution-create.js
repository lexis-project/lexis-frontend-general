import React, { Fragment, useState } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"
import Actions from "../workflowExecutions-actions"
import { WorkflowExecutionForm } from "./workflowExecution-form"

import {
    getWorkflowsDetailId,
    getWorkflowsDetail,
} from "../../workflows/workflows-selectors"

import { getWorkflowExecutionRoutedParameters } from "../../workflowExecutions/workflowExecutions-selectors"
import { getDataSetsList } from "../../entity-repository/entity-repository-selectors"
import { getFetchingStateOfDatasets } from "../../data-sets/data-sets-selectors"
import { extractIntIDandPathFromStagePath } from "../../data-sets/data-sets-utils"

import Switch from "react-input-switch"

import BatchExecForm from "./create-fields/batch-exec-form"

function parseDefaultValue(
    defaultValue,
    paramType,
    paramName,
    key,
    isDataset,
    isDatasetId,
    isDatasetPath,
    datasets
) {
    if (
        defaultValue === undefined ||
        defaultValue === null ||
        defaultValue === "<nil>"
    ) {
        return
    }

    if (isDataset || isDatasetPath) {
        const { internalID, path } =
            extractIntIDandPathFromStagePath(defaultValue)
        const dataset = datasets[internalID]

        if (dataset) {
            const datTitle =
                dataset.metadata.title && dataset.metadata.title !== ""
                    ? dataset.metadata.title
                    : "<missing title>"
            key[`${paramName}_==datasetID`] = {
                label: datTitle,
                value: internalID,
            }
        } else {
            key[`${paramName}_==datasetID`] = {
                value: internalID,
                label: internalID,
            }
        }
        key[`${paramName}_==datasetFilePath`] = path
        return
    } else if (isDatasetId) {
        const dataset = datasets[defaultValue]

        if (dataset) {
            const datTitle =
                dataset.metadata.title && dataset.metadata.title !== ""
                    ? dataset.metadata.title
                    : "<missing title>"
            key[`${paramName}_==datasetID`] = {
                label: datTitle,
                value: defaultValue,
            }
        } else {
            key[`${paramName}_==datasetID`] = {
                value: defaultValue,
                label: defaultValue,
            }
        }
        return
    }

    
    /* boolean */
    if (
        paramType === "boolean" &&
        (defaultValue === "true" ||
        defaultValue === "false" )
    ) {
        /* bools are passed as strings, we must convert then to bools */
        key[paramName] = defaultValue === "true"
        return
    }
    /* default data type */
    if(paramType === 'map')
    {
        key[paramName] = Object.keys(defaultValue).map((parName)=>[parName, defaultValue[parName]])
        return
    }
    key[paramName] = defaultValue
}

/*
 * add parsed default values to routedParameters where it is not already provided
 * i.e, default behaviour is to use inputs provided from 'Recreate workflow'
 */
function prepareInitialValues(routedParameters, workflow, datasets) {
    let initialValues = {}
    let parsedDefaultValues = {}
    initialValues.inputParameters = {}
    if (routedParameters === undefined || routedParameters === null) {
        routedParameters = {}
    }

    if (
        workflow.inputParameters !== undefined &&
        workflow.inputParameters !== null &&
        workflow.inputParameters.length > 0
    ) {
        workflow.inputParameters.forEach(inputParameter => {
            parseDefaultValue(
                inputParameter.inputParamDefaultValue && JSON.parse(inputParameter.inputParamDefaultValue),
                inputParameter.inputParamType,
                inputParameter.inputParamName,
                parsedDefaultValues,
                inputParameter.isDataset === true,
                inputParameter.isDatasetId === true,
                inputParameter.isDatasetPath === true,
                datasets
            )
        })
    }
    Object.assign(
        initialValues.inputParameters,
        parsedDefaultValues,
        routedParameters
    )
    return initialValues
}

export const WorkflowExecutionCreateImpl = ({
    workflow,
    workflowId,
    routedParameters,
    createWorkflowExecution,
    datasets,
    fetchinProg,
}) => {
    const [getExecMode, setExecMode] = useState({
        mode: "basic",
        prevMode: "basic",
    })
    const { mode } = getExecMode
    const setNewMode = nMode => setExecMode({ mode: nMode, prevMode: mode })
    return (
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>Create {"&"} Run Workflow Execution</h1>
                </div>
            </div>
            {workflow && !fetchinProg ? (
                <>
                    <Switch
                        onChange={() =>
                            setNewMode(
                                mode === "batch"
                                    ? getExecMode.prevMode
                                    : "batch"
                            )
                        }
                        on={true}
                        off={false}
                        value={mode === "batch"}
                        id={"batch-mode-switch"}
                        cy={"batch-mode-switch"}
                        className="ml-3"
                        style={{ transform: "scale(1.7)" }}
                    />
                    <label
                        htmlFor={"batch-mode-switch"}
                        className="ml-3 mb-3 text-white">
                        Batch execution
                    </label>
                    {mode === "batch" && (
                        <>
                            <div className="row">
                                <div className="col-9">
                                    <hr />
                                </div>
                            </div>
                            <BatchExecForm />
                            <div className="row">
                                <div className="col-9">
                                    <hr />
                                </div>
                            </div>
                        </>
                    )}
                    {(mode === "basic" ||
                        mode === "schedule" ||
                        mode === "cron") && (
                        <WorkflowExecutionForm
                            form="workflow-execution-create"
                            initialValues={prepareInitialValues(
                                routedParameters,
                                workflow,
                                datasets
                            )}
                            onFormSubmit={createWorkflowExecution}
                        />
                    )}
                </>
            ) : (
                <div className="row">
                    <div className="col-12 text-center">
                        <div
                            className="spinner-border text-light ml-2"
                            role="status"
                            style={{ marginTop: "20vh" }}></div>
                        <h5 className="mt-3">Loading...</h5>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    createWorkflowExecution: Actions.Creators.create,
}

const mapStateToProps = state => ({
    workflowId: getWorkflowsDetailId(state),
    workflow: getWorkflowsDetail(state),
    routedParameters: getWorkflowExecutionRoutedParameters(state),
    datasets: getDataSetsList(state),
    // datasets fetch
    fetchinProg: getFetchingStateOfDatasets(state),
})

export const WorkflowExecutionCreate = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowExecutionCreateImpl)
