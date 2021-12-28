import React, { Fragment } from "react"
import { connect } from "react-redux"

import Actions from "../resources-actions"
import { getProjectDetail } from "../../projects-selectors"
import { ResourceDynamicForm } from "./resource-create-dynamic-form"

export const ResourceCreateDynamicImpl = ({
    project,
    createResourceDynamic,
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>
                    Add resources (dynamic allocation) for{" "}
                    <em>{project.ProjectName}</em>
                </h1>
            </div>
        </div>
        <ResourceDynamicForm
            form="resource-dynamic-form"
            onFormSubmit={createResourceDynamic}
        />
    </Fragment>
)

const mapStateToProps = state => ({
    project: getProjectDetail(state),
})

const mapDispatchToProps = {
    createResourceDynamic: Actions.Creators.create,
}

export const ResourceCreateDynamic = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourceCreateDynamicImpl)
