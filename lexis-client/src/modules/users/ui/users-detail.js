import React, { Fragment, useRef, useState } from "react"
import { connect } from "react-redux"
import { actions as routerActions } from "redux-router5"

import Actions from "../users-actions"
import { getUsersDetail } from "../users-selectors"
import { ROUTE_USERS_EDIT } from "../../routing/routes"
import AuthCheckPermission from "../../auth/auth-check-perms"
import { getUserRole } from "../../auth/auth-selectors"
import { ComponentModal as Modal } from "../../interactiveStyle/component-modal"
import { CheckIAMWritePerms } from "../../auth/auth-check-fine-perms"
import { getOrganizationId } from "../../user/user-selectors"

const goBack = () => window.history.back()

export const UsersDetailImpl = ({ user, gotoRoute, remove, userRole, orgID }) => {
    const [delUser, setUserToDelete] = useState({})
    const modalDelRef = useRef()

    return (
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>User Profile</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <p className="text-info">Username:</p>
                                </div>
                                <div className="col">
                                    <p className="text-info">{user.Username}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>First Name:</p>
                                </div>
                                <div className="col">
                                    <p>{user.FirstName}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Last Name:</p>
                                </div>
                                <div className="col">
                                    <p>{user.LastName}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Email Address:</p>
                                </div>
                                <div className="col">
                                    <p>{user.EmailAddress}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <p>Assigned to organization with ID:</p>
                                </div>
                                <div className="col">
                                    <p>
                                        <code>{user.OrganizationID}</code>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <div className="col-10">
                    <div
                        className="btn-toolbar"
                        role="toolbar"
                        aria-label="Toolbar with button groups">
                        <CheckIAMWritePerms orgID={orgID}>
                            <button
                                type="button"
                                className="btn btn-success btn-simple text-nowrap mr-1"
                                onClick={() =>
                                    gotoRoute(ROUTE_USERS_EDIT, { Id: user.ID })
                                }>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-settings"></i>
                                </span>{" "}
                                Edit
                            </button>
                        </CheckIAMWritePerms>
                        <CheckIAMWritePerms orgID={orgID}>
                            <button
                                type="button"
                                className="btn btn-info btn-simple text-nowrap mx-1"
                                onClick={() => {
                                    setUserToDelete({
                                        ID: user.ID,
                                        FirstName: user.FirstName,
                                        LastName: user.LastName,
                                        EmailAddress: user.EmailAddress,
                                    })
                                    modalDelRef.current.showModal()
                                }}>
                                <span className="white d-inline-flex mx-1">
                                    <i className="tim-icons icon-trash-simple"></i>
                                </span>{" "}
                                Delete
                            </button>
                        </CheckIAMWritePerms>
                        <button
                            type="button"
                            className="btn btn-success btn-link text-nowrap ml-1"
                            onClick={goBack}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                ref={modalDelRef}
                headerTitle="User deletion: Are you sure?"
                acceptTitle="Remove user"
                acceptButtonClass="btn-warning"
                onAccept={() => {
                    remove(delUser.ID)
                    setUserToDelete({})
                }}
                onClose={() => setUserToDelete({})}>
                <h4 className="text-dark">Deletion of:</h4>
                {delUser && (
                    <>
                        <div className="row">
                            <div className="col-3">First Name: </div>
                            <div className="col-9">{delUser.FirstName}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">Last Name: </div>
                            <div className="col-9">{delUser.LastName}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">Email: </div>
                            <div className="col-9">{delUser.EmailAddress}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">ID: </div>
                            <div className="col-9">
                                <pre className="text-warning">{delUser.ID}</pre>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    user: getUsersDetail(state),
    userRole: getUserRole(state),
    orgID: getOrganizationId(state)
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
    remove: Actions.Creators.remove,
}

export const UsersDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersDetailImpl)
