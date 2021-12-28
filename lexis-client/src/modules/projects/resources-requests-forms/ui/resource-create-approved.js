import React, { Fragment } from "react"
import { connect } from "react-redux"

import Actions from "../resources-actions"
import { getProjectDetail, getProjectUsersEmails } from "../../projects-selectors"
import { getUserCreatedByEmail } from "../../../users/users-selectors"
import { ApprovedResourceRequestForm } from "./resource-create-approved-form"

export const ApprovedResourceRequestCreateImpl = ({
    project,
    createResourceApproved,
    usersEmails
}) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>
                    Add resources (approved) for project <em>{project.ProjectName}</em>
                </h1>
            </div>
        </div>
        <ApprovedResourceRequestForm
            usersEmails={usersEmails}
            form="resource-approved-form"
            onFormSubmit={createResourceApproved}
        />
    </Fragment>
)

const mapStateToProps = state => {
    let projectUsersEmails = getProjectUsersEmails(state)
    const createdByEmail = getUserCreatedByEmail(state)
    projectUsersEmails = projectUsersEmails.length === 0 ? [createdByEmail] : projectUsersEmails

    return ({
        project: getProjectDetail(state),
        usersEmails: projectUsersEmails,
    })
}

const mapDispatchToProps = {
    createResourceApproved: Actions.Creators.createApproved,
}

export const ApprovedResourceRequestCreate = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApprovedResourceRequestCreateImpl)
