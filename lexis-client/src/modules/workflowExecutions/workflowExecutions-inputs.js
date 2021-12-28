import React, { Component } from "react"
import Popup from "reactjs-popup"

import { ReduxFormInputField } from "../forms/input-field"
import { ReduxFormCheckboxField } from "../forms/checkbox-field"
import { ReduxFormExecutionArrayInputField } from "../forms/array-input-field-workflow-execution"
import { ReduxFormMapInputField } from "../forms/map-input-field"
import { HEAppEFields } from "../forms/heappe/heappe-fields"
import { DDIFields } from "../forms/ddi/ddi-fields"
import WorkflowExecutionsDataSetsField from "./ui/create-fields/workflowExecutions-data-sets-field"

class PopupField extends Component {
    render() {
        return (
            <>
                <div className="row">
                    <div className="col">
                        <label htmlFor={this.props.label}>
                            {this.props.label}
                        </label>
                    </div>
                </div>
                <Popup
                    trigger={
                        <button
                            type="button"
                            className="btn btn-simple text-nowrap mr-1"
                            variant="primary">
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-pencil"></i>
                            </span>
                        </button>
                    }
                    position="bottom left"
                    contentStyle={{ width: "62%" }}
                    nested>
                    <div className="card" style={{ border: "2px solid white" }}>
                        <div className="card-header">{this.props.label}</div>
                        <div className="card-body">{this.props.children}</div>
                    </div>
                </Popup>
            </>
        )
    }
}

class InputFields extends Component {
    handleInputType(inputParameter) {
        switch (inputParameter.inputParamType) {
        case "list":
            return (
                <ReduxFormExecutionArrayInputField
                    type="text"
                    key={inputParameter.inputParamName}
                    name={`inputParameters.${inputParameter.inputParamName}`}
                    label={inputParameter.displayName}
                    info={inputParameter.description}
                    placeholder={
                        "Please provide " + inputParameter.displayName
                    }
                    required={inputParameter.inputParamRequired}
                />
            )

        case "map":

            return (
                <ReduxFormMapInputField
                    key={inputParameter.inputParamName}
                    name={`inputParameters.${inputParameter.inputParamName}`}
                    type="text"
                    label={inputParameter.displayName}
                    info={inputParameter.description}
                    placeholder={["Please enter Key", "Please enter Value"]}
                    required={inputParameter.inputParamRequired}
                />
            )

        case "boolean":
            return (
                <ReduxFormCheckboxField
                    key={inputParameter.inputParamName}
                    name={`inputParameters.${inputParameter.inputParamName}`}
                    label={inputParameter.displayName}
                    info={inputParameter.description}
                    required={inputParameter.inputParamRequired}
                />
            )

        case "org.lexis.common.ddi.types.Metadata":
            return (
                <PopupField
                    label={inputParameter.displayName}
                    children={
                        <DDIFields
                            name={`inputParameters.${inputParameter.inputParamName}`}
                            inputParameter={inputParameter}
                        />
                    }
                />
            )

        case "org.lexis.common.heappe.types.JobSpecification":
            return (
                <HEAppEFields
                    name={`inputParameters.${inputParameter.inputParamName}`}
                    inputParameter={inputParameter}
                />
            )

        default:
            return (
                <ReduxFormInputField
                    key={inputParameter.inputParamName}
                    name={`inputParameters.${inputParameter.inputParamName}`}
                    type="text"
                    label={inputParameter.displayName}
                    info={inputParameter.description}
                    placeholder={
                        "Please provide " + inputParameter.displayName
                    }
                    required={inputParameter.inputParamRequired}
                />
            )
        }
    }

    renderInputField(inputParameter) {
        return (
            <div>
                {/* DataSetField returns path to file in dataset */}
                {inputParameter.isDataset === true ||
                inputParameter.isDatasetId === true ||
                inputParameter.isDatasetPath ? (
                        <WorkflowExecutionsDataSetsField
                            inputParameter={inputParameter}
                            datasets={this.props.datasets}
                            projectShortName={this.props.workflow.projectShortName}
                            formName={this.props.formName}
                            fullPathRequired={inputParameter.isDatasetPath}
                        />
                    ) : (
                        this.handleInputType(inputParameter)
                    )}
            </div>
        )
    }

    renderCategory(category, titles, values) {
        return (
            <div className="card">
                <div className="card-header">
                    {category[0].toUpperCase() + category.substring(1)} Inputs
                </div>
                <div className="card-body">
                    {this.props.workflow.inputParameters && this.props.workflow.inputParameters.map(
                        (inputParameter, index) => (
                            <div key={index}>
                                {inputParameter.inputParamName !== "token" &&
                                inputParameter.task === category
                                    ? this.renderInputField(inputParameter)
                                    : null}
                            </div>
                        )
                    )}
                </div>
            </div>
        )
    }

    render() {
        return this.props.workflow.inputParameters != null ? (
            <div>
                {this.props.isPreprocessing &&
                    this.renderCategory("preprocessing")}
                {this.props.isComputation && this.renderCategory("computation")}
                {this.props.isPostprocessing &&
                    this.renderCategory("postprocessing")}
                {this.props.isVisualization &&
                    this.renderCategory("visualization")}
            </div>
        ) : null
    }
}

export { InputFields }
