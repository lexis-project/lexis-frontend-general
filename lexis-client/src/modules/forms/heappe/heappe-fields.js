import React, { Component } from "react"

import { ReduxFormInputField } from "./../input-field"
import { ReduxFormCheckboxField } from "./..//checkbox-field"
import { ReduxFormExecutionArrayInputField } from "./..//array-input-field-workflow-execution"
import { connect } from "react-redux"
import { getWorkflowsDetail } from "../../workflows/workflows-selectors"
import { GENERIC_TEMP_ID } from "./heappe-task-templateParamVals-input-field"
import { getFetchingStateOfHPCResources, getHPCResourcesList } from "../../projects/resources/list-hpc-resources-selectors"
import { ReduxFormSelectField } from "../select-field"

const getDisplayNames = (resource) => `Provider: ${resource.HPCProvider} | ResourceType: ${resource.ResourceType} | CloudNetworkName: ${resource.CloudNetworkName}`

const HEAppEFieldsImpl = ({hpcResources, hpcResourceFetchStatus, workflow, inputParameter, name}) => {
    let acceptedHPCResources = []
    let acceptedHPCDisplayNames = []
    let acceptedHPCIds = []
    if(hpcResources)
    {
        acceptedHPCResources=hpcResources.filter(resource=>resource.ApprovalStatus==="ACCEPTED")
        acceptedHPCDisplayNames=acceptedHPCResources.map(getDisplayNames)
        acceptedHPCIds=acceptedHPCResources.map((resource)=>resource.HPCResourceID)
    }
    // ApprovalStatus(pin): "ACCEPTED"
    // AssociatedHPCProject(pin): "di46sov"
    // AssociatedLEXISProject(pin): "LEXIS_ID_2"
    // CloudNetworkName(pin): "internet_pool"
    // HEAppEEndpoint(pin): "https://heappe.lexis.lrz.de/lexisdemo"
    // HPCProvider(pin): "LRZ"
    // HPCResourceID(pin): "8001c68f-cdcc-9eaf-496c-408d1ae405ce"
    // OpenStackEndpoint(pin): "https://cc.lrz.de"
    // ResourceType(pin): "CLOUD"
    // TermsConsent(pin): true
    return (
        <div className="col ml-1">
            <hr/>
            <h6>{inputParameter.displayName}</h6>
            <div className="ml-1">
                <ReduxFormInputField
                    key={`${inputParameter.inputParamName}.Name`}
                    name={`${name}.Name`}
                    type="text"
                    info="Job Name"
                    placeholder="Please provide job name"
                    label="Name"
                    required={true}
                />

                {workflow && GENERIC_TEMP_ID.includes(workflow.workflowTemplateID) && !hpcResourceFetchStatus ? (
                    <ReduxFormSelectField
                        name="%%internal%%HEAPPE_RESOURCE_ID__"
                        displayNames={acceptedHPCDisplayNames}
                        values={acceptedHPCIds}
                        required={true}
                        placeholder="Please select target HPC resource"
                        label="HPC Resource"
                    />
                ):(
                    <span className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </span>
                )}

                <ReduxFormInputField
                    key={`HEAppEFields.Project`}
                    name={`${name}.Project`}
                    type="text"
                    info="Accounting Project"
                    placeholder="Please provide accounting project"
                    label="Project"
                    hidden={true}
                    //required={true}
                />
                <ReduxFormInputField
                    key={`HEAppEFields.ClusterId`}
                    name={`${name}.ClusterId`}
                    type="text"
                    info="Cluster ID"
                    placeholder="Please provide cluster ID"
                    label="Cluster ID"
                    hidden={true}
                />
                <ReduxFormInputField
                    key={`HEAppEFields.WaitingLimit`}
                    name={`${name}.WaitingLimit`}
                    type="text"
                    info="Limit for waiting time in cluster que (seconds)"
                    placeholder="Please provide waiting limit"
                    label="Waiting Limit"
                    hidden={true}
                />
                <ReduxFormInputField
                    key={`HEAppEFields.FileTransferMethodId`}
                    name={`${name}.FileTransferMethodId`}
                    type="text"
                    info="File transfer method (1 for NetworkShare, 2 or 3 for SftpScp, set by the orchestrator according to the cluster ID)"
                    placeholder="Please provide file transfer method"
                    label="FileTransferMethodId"
                    hidden={true}
                />
                <ReduxFormInputField
                    key={`HEAppEFields.NotificationEmail`}
                    name={`${name}.NotificationEmail`}
                    type="text"
                    info="Notification email"
                    placeholder="Please provide notification email"
                    label="Notification Email"
                />
                {/* <ReduxFormInputField
                    key={`HEAppEFields.PhoneNumber`}
                    name={`${name}.PhoneNumber`}
                    type="text"
                    info="Phone number"
                    placeholder="Please provide phone number"
                    label="Phone Number"
                /> */}
                <ReduxFormCheckboxField
                    key={`HEAppEFields.NotifyOnAbort`}
                    name={`${name}.NotifyOnAbort`}
                    label="Notify On Abort"
                    info="Send an email notification on job cancelation"
                />
                <ReduxFormCheckboxField
                    key={`HEAppEFields.NotifyOnFinish`}
                    name={`${name}.NotifyOnFinish`}
                    label="Notify On Finish"
                    info="Send an email notification on job end"
                />
                <ReduxFormCheckboxField
                    key={`HEAppEFields.NotifyOnStart`}
                    name={`${name}.NotifyOnStart`}
                    label="Notify On Start"
                    info="Send an email notification on job start"
                />
                <ReduxFormExecutionArrayInputField
                    key={`HEAppEFields.Tasks`}
                    name={`${name}.Tasks`}
                    label="Task"
                    type="HEAppETask"
                    info="Task"
                />
            </div>
            <hr/>
        </div>
    )
}

const mapStateToProps = (state) => ({
    hpcResources: getHPCResourcesList(state),
    hpcResourceFetchStatus: getFetchingStateOfHPCResources(state),
    workflow: getWorkflowsDetail(state)
})

const HEAppEFields = connect(mapStateToProps)(HEAppEFieldsImpl)
export { HEAppEFields }
