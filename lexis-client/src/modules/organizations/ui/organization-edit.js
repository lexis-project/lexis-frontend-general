import React, { Fragment } from "react"
import { OrganizationForm } from "./organization-form"
import { connect } from "react-redux"

import Actions from "../organizations-actions"
import { getOrganizationDetail } from "../organizations-selectors"

export const OrganizationEditImpl = ({ organization, editOrganization }) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Edit organization</h1>
            </div>
        </div>
        <OrganizationForm
            form="organization-edit"
            initialValues={organization}
            onFormSubmit={editOrganization}
        />
    </Fragment>
)

const mapDispatchToProps = {
    editOrganization: Actions.Creators.update,
}

const mapStateToProps = state => ({
    organization: getOrganizationDetail(state),
})

export const OrganizationEdit = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizationEditImpl)
