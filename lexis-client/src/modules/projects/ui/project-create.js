import React, { Fragment } from "react"
import { connect } from "react-redux"

import Actions from "../projects-actions"
import { ProjectForm } from "./project-form"

export const ProjectCreateImplementation = ({ createProject }) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Create new LEXIS project</h1>
            </div>
        </div>
        <ProjectForm form="project-create" onFormSubmit={createProject} />
    </Fragment>
)

const mapDispatchToProps = {
    createProject: Actions.Creators.create,
}

export const ProjectCreate = connect(
    null,
    mapDispatchToProps
)(ProjectCreateImplementation)
