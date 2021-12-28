import React, { Fragment } from "react"
import { OrganizationForm } from "./organization-form"
import { connect } from "react-redux"

import Actions from "../organizations-actions"

export const OrganizationCreateImpl = ({ createOrganization }) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Register new organization</h1>
            </div>
        </div>
        <OrganizationForm
            form="organization-create"
            onFormSubmit={createOrganization}
        />
    </Fragment>
)
const mapDispatchToProps = {
    createOrganization: Actions.Creators.create,
}

export const OrganizationCreate = connect(
    null,
    mapDispatchToProps
)(OrganizationCreateImpl)
