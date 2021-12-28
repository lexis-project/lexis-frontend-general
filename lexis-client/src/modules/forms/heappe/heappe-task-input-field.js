import React, { Component } from "react"

import { ReduxFormInputField } from "./../input-field"
import { ReduxFormExecutionArrayInputField } from "./../array-input-field-workflow-execution"
import { ReduxFormCheckboxField } from "./../checkbox-field"
import { connect } from "react-redux"
import { getAdditionalHeappeFields } from "../../workflowExecutions/workflowExecutions-selectors"
import { getWorkflowsDetail } from "../../workflows/workflows-selectors"
//values are arrays; allow modification, adition and deletion
//https://redux-form.com/8.3.0/examples/fieldarrays/
//https://gist.github.com/erikras/50b7b4bb4b4907b40a5ca9d99c2ff77e
//TODO

//{ fields, type, placeholder, label, input, initialValue, meta: { error, touched, dirty } }
const  ReduxFormHeappeTaskInputFieldImpl = ({type, name, workflow, additionalHeappeFields}) => {
    return (
        <div key={name} className="row">
            <div className="col">
                <ReduxFormInputField
                    name={`${name}.Name`}
                    type={type}
                    info="Task name"
                    placeholder="Please provide task name"
                    label="Name"
                    required={true}
                />
                <ReduxFormInputField
                    name={`${name}.ClusterNodeTypeId`}
                    type={type}
                    info="Cluster node type ID"
                    placeholder="Please provide cluster node type ID"
                    label="ClusterNodeTypeId"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.CommandTemplateId`}
                    type={type}
                    info="Command template ID"
                    placeholder="Please provide command template ID"
                    label="CommandTemplateId"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.WalltimeLimit`}
                    type={type}
                    info="Maximum time for the task to run (in seconds)"
                    placeholder="Please provide wall time limit"
                    label="Walltime Limit"
                    required={true}
                />
                <ReduxFormInputField
                    name={`${name}.MinCores`}
                    type={type}
                    info="Mininum number of cores required"
                    placeholder="Please provide mininum number of cores"
                    label="MinCores"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.MaxCores`}
                    type={type}
                    info="Maximum number of cores required"
                    placeholder="Please provide maximum number of cores"
                    label="MaxCores"
                />
                <ReduxFormInputField
                    name={`${name}.Priority`}
                    type={type}
                    info="Job priority"
                    placeholder="Please provide job priority"
                    label="Priority"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.JobArrays`}
                    type={type}
                    info="Job arrays"
                    placeholder="Please provide job arrays"
                    label="JobArrays"
                />
                <ReduxFormInputField
                    name={`${name}.StandardInputFile`}
                    type={type}
                    info="Standard input file"
                    placeholder="Please provide standard input file"
                    label="StandardInputFile"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.StandardOutputFile`}
                    type={type}
                    info="Standard output file"
                    placeholder="Please provide standard output file"
                    label="StandardOutputFile"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.StandardErrorFile`}
                    type={type}
                    info="Standard error file"
                    placeholder="Please provide standard error file"
                    label="StandardErrorFile"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.ProgressFile`}
                    type={type}
                    info="Progress file"
                    placeholder="Please provide progress file"
                    label="ProgressFile"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.LogFile`}
                    type={type}
                    info="Log file"
                    placeholder="Please provide log file"
                    label="LogFile"
                    hidden={true}
                />
                <ReduxFormInputField
                    name={`${name}.ClusterTaskSubdirectory`}
                    type={type}
                    info="Cluster task subdirectory"
                    placeholder="Please provide cluster task subdirectory"
                    label="ClusterTaskSubdirectory"
                    hidden={true}
                />
                <ReduxFormCheckboxField
                    name={`${name}.IsExclusive`}
                    label="IsExclusive"
                    info="Is it exclusive?"
                    hidden={true}
                />
                <ReduxFormCheckboxField
                    name={`${name}.IsRerunnable`}
                    label="IsRerunnable"
                    info="Is it rerunnable?"
                    hidden={true}
                />
                <ReduxFormCheckboxField
                    name={`${name}.CpuHyperThreading`}
                    label="CpuHyperThreading"
                    info="Cpu Hyperthreading"
                    hidden={true}
                />
                <ReduxFormExecutionArrayInputField
                    name={`${name}.RequiredNodes`}
                    type="text"
                    label="RequiredNode"
                    info="Required node"
                    placeholder="Please provide required node"
                    hidden={true}
                />
                <ReduxFormExecutionArrayInputField
                    name={`${name}.TemplateParameterValues`}
                    type="HEAppETaskTemplateParamVals"
                    label="TemplateParameterValue"
                    info="Template Parameter Values"
                />
                <ReduxFormExecutionArrayInputField
                    name={`${name}.TaskParalizationParameters`}
                    type="HEAppETaskParalizationParameters"
                    label="TaskParalizationParameter"
                    info="Parameters related to parallelization"
                />
                <ReduxFormExecutionArrayInputField
                    name={`${name}.EnvironmentVariables`}
                    type="HEAppETaskEnvironmentVariables"
                    label="EnvironmentVariable"
                    info="Environment Variables"
                />
            </div>
        </div>
    )
}

/*
 * defaultValue={input.initialValue===undefined || input.length<=index||dirty
 *                               ?undefined
 *                                                             :input.initialValue[index]}
 */

const mapStateToProps = (state) => ({
    workflow: getWorkflowsDetail(state),
    additionalHeappeFields: getAdditionalHeappeFields(state)
})
const ReduxFormHeappeTaskInputField = connect(mapStateToProps)(ReduxFormHeappeTaskInputFieldImpl)


//rgh: I have the problem at https://github.com/redux-form/redux-form/issues/2291
//deletes always the latest field. Using a simple input again here due to this.

export { ReduxFormHeappeTaskInputField }
