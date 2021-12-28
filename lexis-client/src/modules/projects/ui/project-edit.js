import React, { Fragment } from "react"
import { connect } from "react-redux"

import Actions from "../projects-actions"
import { ProjectForm } from "./project-form"
import { getProjectDetail, getProjectShortName } from "../projects-selectors"

export const ProjectEditImplementation = ({
    editProject,
    project,
    projectShortName,
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Edit project</h1>
            </div>
        </div>
        <ProjectForm
            form="project-edit"
            onFormSubmit={editProject}
            initialValues={project}
            projectShortName={projectShortName}
            editForm={true}
        />
    </Fragment>
)

const mapStateToProps = state => ({
    project: getProjectDetail(state),
    projectShortName: getProjectShortName(state),
})

const mapDispatchToProps = {
    editProject: Actions.Creators.update,
}

export const ProjectEdit = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectEditImplementation)
