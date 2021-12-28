import React, { Fragment } from "react"
import { connect } from "react-redux"

import { UsersForm } from "./users-form"
import Actions from "../users-actions"
import { getUsersDetail } from "../users-selectors"

export const UsersEditImpl = (
    { editUsers, user, firstname, lastname },
    props
) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Edit user</h1>
            </div>
        </div>
        <UsersForm
            form="users-edit"
            initialValues={user}
            onFormSubmit={editUsers}
            {...props}
            firstname={firstname}
            lastname={lastname}
            {...props}
        />
    </Fragment>
)
const mapDispatchToProps = {
    editUsers: Actions.Creators.update,
}

const mapStateToProps = state => ({
    user: getUsersDetail(state),
})

export const UsersEdit = connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersEditImpl)
