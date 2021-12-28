import React, { Fragment, useRef, useState } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import { ROUTE_USERS_DETAIL, ROUTE_USERS_CREATE } from "../../routing/routes"
import { getUsers } from "../users-selectors"
import { getUserName, getUsernameError } from "../../auth/auth-selectors"

import AuthCheckPermission from "../../auth/auth-check-perms"
import { getUserRole } from "../../auth/auth-selectors"
import { CheckIAMWritePerms, CheckOrgWritePerms } from "../../auth/auth-check-fine-perms"
import usersActions from "../users-actions"
import {ComponentModal as Modal} from '../../interactiveStyle/component-modal'
import organizationsActions from "../../organizations/organizations-actions"
import { getOrganizationId, getOrganizationName } from "../../user/user-selectors"
import { getOrganizations } from "../../entity-repository/entity-repository-selectors"

export const UsersListImpl = ({
    gotoRoute,
    users,
    userRole,
    deleteUser,
    setMgr,
    userOrgID,
    userOrgName,
    organizations
}) => {
    const [delUser, setUserToDelete] = useState({})
    const modalDelRef = useRef()
    const [mgrUser, setUserToMgr] = useState({})
    const modalMGRSetRef = useRef()
    
    /*
    TODO FIXME - when user is created, toast either will warn, or informs about success
    if (username) {
        ToastsStore.success("Creating the new user of the LEXIS Portal succeeded. Your unique username: " + username, 1000)
    }   
        
    if (usernameError) { 
        ToastsStore.warning("Creating the new user of the LEXIS Portal failed. Was username creation OK? " + usernameError, 10000)
    }*/

    return (
        <Fragment>
            <div className="row">
                <div className="col">
                    <h1>Users</h1>
                </div>
                <AuthCheckPermission
                    permissionName="create-users"
                    userRole={userRole}>
                    <div className="col-4" style={{ textAlign: "right" }}>
                        <button
                            type="button"
                            className="btn btn-info btn-simple text-nowrap"
                            onClick={() => gotoRoute(ROUTE_USERS_CREATE)}>
                            <span className="white d-inline-flex mx-1">
                                <i className="tim-icons icon-simple-add"></i>
                            </span>{" "}
                        Register new user
                        </button>
                    </div>
                </AuthCheckPermission>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email Address</th>
                                            {/* <th>Username</th> */}
                                            <th>Organization</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    style={{ textAlign: "center" }}>
                                                Empty list of users
                                                </td>
                                            </tr>
                                        )}
                                        {users.map(
                                            ({
                                                ID,
                                                FirstName,
                                                LastName,
                                                EmailAddress,
                                                username,
                                                OrganizationID
                                            }) => (
                                                <tr key={ID}>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link"
                                                            onClick={() =>
                                                                gotoRoute(
                                                                    ROUTE_USERS_DETAIL,
                                                                    { Id: ID }
                                                                )
                                                            }>
                                                            {FirstName}
                                                        </button>
                                                    </td>
                                                    <td>{LastName}</td>
                                                    <td>{EmailAddress}</td>
                                                    {/* <td>{username}</td> */}
                                                    <td>{ organizations[OrganizationID] ? organizations[OrganizationID].FormalName :                                                    (<code>{OrganizationID}</code>)}</td>
                                                    <td>
                                                        <CheckIAMWritePerms orgID={OrganizationID}>
                                                            <button
                                                                className="btn btn-warning btn-simple text-nowrap mr-1"
                                                                onClick={()=>{setUserToDelete({ID, FirstName, LastName, EmailAddress, OrganizationID});modalDelRef.current.showModal()}}
                                                            >
                                                                <span className="white d-inline-flex mx-1">
                                                                    <i className="tim-icons icon-trash-simple"></i>
                                                                </span>{" "}
                                                    Delete
                                                            </button>
                                                        </CheckIAMWritePerms>
                                                        {OrganizationID == userOrgID && (
                                                            <CheckIAMWritePerms orgID={OrganizationID}>
                                                                <CheckOrgWritePerms orgID={OrganizationID}>
                                                                    <button
                                                                        className="btn btn-secondary btn-simple text-nowrap ml-2 mr-1"
                                                                        onClick={()=>{setUserToMgr({ID, FirstName, LastName, EmailAddress, OrganizationID});modalMGRSetRef.current.showModal()}}
                                                                    >
                                                                        <span className="white d-inline-flex mx-1">
                                                                            <i className="tim-icons icon-simple-add"></i>
                                                                        </span>{" "}
                                                            Set as Org MGR of <em>{userOrgName}</em>
                                                                    </button>
                                                                </CheckOrgWritePerms>
                                                            </CheckIAMWritePerms>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                ref={modalDelRef}
                headerTitle="User deletion: Are you sure?"
                acceptTitle="Remove user"
                acceptButtonClass="btn-warning"
                onAccept={()=> {deleteUser(delUser.ID);setUserToDelete({});}}
                onClose={()=>setUserToDelete({})}
            >
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
                            <div className="col-9"><pre className="text-warning">{delUser.ID}</pre></div>
                        </div>
                        <div className="row">
                            <div className="col-3">Organization: </div>
                            <div className="col-9">{organizations[delUser.OrganizationID] ? organizations[delUser.OrganizationID].FormalName : (<pre>{delUser.OrganizationID}</pre>)}</div>
                        </div>
                    </>
                )}
            </Modal>
            <Modal
                ref={modalMGRSetRef}
                headerTitle="Are you sure?"
                acceptTitle="Set as Organization Manager"
                acceptButtonClass="btn-success btn-simple"
                onAccept={()=> {setMgr(mgrUser.ID);setUserToMgr({});}}
                onClose={()=>setUserToMgr({})}
            >
                <h4 className="text-dark">Giving the Organization Manager permissions to the following user:</h4>
                {mgrUser && (
                    <>
                        <div className="row">
                            <div className="col-3">First Name: </div>
                            <div className="col-9">{mgrUser.FirstName}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">Last Name: </div>
                            <div className="col-9">{mgrUser.LastName}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">Email: </div>
                            <div className="col-9">{mgrUser.EmailAddress}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">ID: </div>
                            <div className="col-9"><pre className="text-warning">{mgrUser.ID}</pre></div>
                        </div>
                        <div className="row">
                            <div className="col-3">Organization: </div>
                            <div className="col-9">{organizations[mgrUser.OrganizationID] ? organizations[mgrUser.OrganizationID].FormalName : (<pre>{mgrUser.OrganizationID}</pre>)}</div>
                        </div>
                        {/* <td></td> */}
                    </>
                )}
            </Modal>
        </Fragment>
    )}

const mapDispatchToProps = {
    gotoRoute: actions.navigateTo,
    getTransition: actions.transitionStart,
    deleteUser: usersActions.Creators.remove,
    setMgr: organizationsActions.Creators.setMgr
}

const mapStateToProps = state => {
    let users = getUsers(state)
    let username = getUserName(state, 1)

    return {
        users: getUsers(state),
        userRole: getUserRole(state),
        username: username,
        usernameError: getUsernameError(state, 1),
        getAllOrgUsernames: users,
        users: getUsers(state),
        userRole: getUserRole(state),
        userOrgID: getOrganizationId(state),
        userOrgName: getOrganizationName(state),
        organizations: getOrganizations(state)
    }
}

export const UsersList = connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersListImpl)
