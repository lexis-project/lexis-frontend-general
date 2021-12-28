import React, { Fragment } from "react"
import { connect } from "react-redux"

import Actions from "../../workflows/workflows-actions"
import { WorkflowForm } from "./workflow-form"
import {
    getWorkflowTemplatesDetailId,
    getWorkflowTemplatesDetail,
} from "../../workflowTemplates/workflowTemplates-selectors"

export const WorkflowCreateImpl = ({
    workflowTemplate,
    workflowTemplateId,
    createWorkflow,
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Create Workflow</h1>
            </div>
        </div>
        <WorkflowForm
            form="workflow-create"
            onFormSubmit={createWorkflow} //Really we want to save the inputs here and not create workflow until later
            initialValues={{ workflowTemplateID: workflowTemplateId }}
        />
    </Fragment>
)

const mapStateToProps = state => ({
    workflowTemplateId: getWorkflowTemplatesDetailId(state),
    workflowTemplate: getWorkflowTemplatesDetail(state),
})

const mapDispatchToProps = {
    createWorkflow: Actions.Creators.create,
}

export const WorkflowCreate = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkflowCreateImpl)
