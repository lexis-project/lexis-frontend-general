import React, { Fragment } from "react"
import { UserPageForm } from "./user-form"
import { connect } from "react-redux"

import Actions from "../user-actions"
import { getLoggedInUsersDetail } from "../../users/users-selectors"

export const UserPageEditImpl = ({ user, editUserProfile }) => (
    <Fragment>
        <div className="row">
            <div className="col">
                <h1>Edit User Profile</h1>
            </div>
        </div>
        <UserPageForm
            form="user-edit"
            initialValues={user}
            onFormSubmit={editUserProfile}
        />
    </Fragment>
)
const mapDispatchToProps = {
    editUserProfile: Actions.Creators.update,
}

const mapStateToProps = state => ({
    user: getLoggedInUsersDetail(state),
})

export const UserPageEdit = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPageEditImpl)
