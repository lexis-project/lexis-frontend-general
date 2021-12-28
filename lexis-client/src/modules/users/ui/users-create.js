import React, { Fragment } from "react"
import { connect } from "react-redux"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"
import {
    getAllowedOrganizations,
    getOrganizationId,
} from "../../user/user-selectors"

import Actions from "../users-actions"
import { UsersForm } from "./users-form"
import { getFirstName, getLastName } from "../users-selectors"

export const UserCreateImpl = (
    {
        createUser,
        allowedOrganizations,
        organizationId,
        organizations,
        firstname,
        lastname,
    },
    props
) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Register new user</h1>
            </div>
        </div>
        <UsersForm
            form="user-create"
            onFormSubmit={createUser}
            firstname={firstname}
            lastname={lastname}
            {...props}
            allowedOrganizations={allowedOrganizations}
            organizationId={organizationId}
            organizations={organizations}
        />
    </Fragment>
)
const mapStateToProps = state => {
    const first = getFirstName(state)
    const last = getLastName(state)

    return {
        firstname: first,
        lastname: last,
        allowedOrganizations: getAllowedOrganizations(state),
        organizationId: getOrganizationId(state),
        organizations: getOrganizations(state),
    }
}

const mapDispatchToProps = {
    createUser: Actions.Creators.create,
}

export const UserCreate = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCreateImpl)
