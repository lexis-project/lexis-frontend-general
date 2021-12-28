// eslint-disable jsx-a11y/no-onchange
import React, {useRef, useState} from 'react'
import { connect } from 'react-redux'
import { ROUTE_PROJECT_DETAIL } from '../../routing/routes'
import { loadStringOrLoading } from '../../utils'
import { getProjectDetail, getProjectId, getProjectUserAddForm, getProjectUsers } from '../projects-selectors'
import { actions as routerActions } from "redux-router5"
import ProjectUsersManagerAddForm from './project-users-manager-add-form'
import projectsActions from '../projects-actions'
import { CheckFineWritePermsComp, CheckIAMWritePerms } from '../../auth/auth-check-fine-perms'
import {ComponentModal as Modal} from '../../interactiveStyle/component-modal'
import { getOrganizations } from '../../entity-repository/entity-repository-selectors'
import ProjectUsersPerms from './project-users-perms'

const setAccept = (modalAssignRole, roleForAssign, setRole, userForRoleAssign, setUserForRoleAssign, setRoleForAssign) => {
    if(modalAssignRole.current){
        modalAssignRole.current.setAcceptFn(()=> {
            setRole(userForRoleAssign.ID,roleForAssign)
            setUserForRoleAssign({})
            setRoleForAssign({})
        })
    }
}
const ProjectUsersImpl = ({
    projectID,
    project,
    projUsers,
    gotoRoute,
    userAddFormVisibility,
    changeAddVisibility,
    unassignUser,
    organizations,
    setRole
}) => {
    const modalAssignRole = useRef()
    const [userForRoleAssign, setUserForRoleAssign] = useState({})
    const [roleForAssign, setRoleForAssign] = useState({})

    return(
        <div className="row">
            <div className="col">
                <div className="row">
                    <button
                        className="btn btn-link"
                        onClick={()=> gotoRoute(ROUTE_PROJECT_DETAIL, {id: projectID})}
                    >
        Project: <em>{loadStringOrLoading(project,'ProjectName')}</em>
                    </button>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>User management</h2>
                    </div>
                    {project && (
                        <CheckIAMWritePerms orgID={project.LinkedOrganization}>
                            <CheckFineWritePermsComp
                                type="prj"
                                prjID={projectID}
                            >
                                {!userAddFormVisibility && <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-simple text-nowrap mr-1"
                                        onClick={changeAddVisibility}
                                        cy="assign-user-to-project"
                                    >
                                        <span className="white d-inline-flex mx-1">
                                            <i className="tim-icons icon-simple-add"></i>
                                        </span>{" "}
                Assign User to Project
                                    </button>
                                </div>}
                            </CheckFineWritePermsComp>
                        </CheckIAMWritePerms>
                    )}
                </div>
                { project && ( 
                    <CheckIAMWritePerms  orgID={project.LinkedOrganization}>
                        <CheckFineWritePermsComp
                            type="prj"
                            prjID={projectID}
                        >
                            {userAddFormVisibility && <ProjectUsersManagerAddForm />}
                        </CheckFineWritePermsComp>
                    </CheckIAMWritePerms>
                )}


                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table
                                        className="table table-striped table-bordered table-hover"
                                        cy="project-users-list"
                                    >
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Second Name</th>
                                                <th>Email Address</th>
                                                <th>Organization</th>
                                                <th>Dat access</th>
                                                <th>Dat creation</th>
                                                <th>Dat pub. creation</th>
                                                <th>Prj mgr</th>
                                                <th>WF mgr</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {project && projUsers && projUsers
                                                .map((user)=>(<tr key={user.ID}>
                                                    <td cy="user-first-name">{user.FirstName}</td>
                                                    <td>{user.LastName}</td>
                                                    <td>{user.EmailAddress}</td>
                                                    <td>{ organizations[user.OrganizationID] ? organizations[user.OrganizationID].FormalName : (<pre>{user.OrganizationID}</pre>)}</td>
                                                    <CheckIAMWritePerms  orgID={project.LinkedOrganization}><ProjectUsersPerms usrId={user.ID} prjId={projectID} /></CheckIAMWritePerms>
                                                    <CheckIAMWritePerms  orgID={project.LinkedOrganization}>
                                                        <CheckFineWritePermsComp
                                                            type="prj"
                                                            prjID={projectID}
                                                        >
                                                            <td style={{ textAlign: "right" }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-info btn-simple text-nowrap mr-1"
                                                                    cy={`button-unassign-user`}
                                                                    onClick={() =>{ 
                                                                        setUserForRoleAssign(user)
                                                                        modalAssignRole.current.showModal()
                                                                    }}
                                                                >
                                                                    <span className="white d-inline-flex mx-1">
                                                                        <i className="tim-icons icon-bullet-list-67"></i>
                                                                    </span>{" "}
                                                                    {"Set User Role"}
                                                                </button>
                                                                {/* TODO: blocking until remove specific role will work */}
                                                                {/* <button
                            type="button"
                            className="btn btn-info btn-simple text-nowrap"
                            cy={`button-unassign-user`}
                            onClick={() => unassignUser(user.ID)}
                        >
                            <span className="white d-inline-flex mx-1">
                            <i className="tim-icons icon-trash-simple"></i>
                            </span>{" "}
                            {"Remove User"}
                        </button> */}
                                                            </td>
                                                        </CheckFineWritePermsComp>
                                                    </CheckIAMWritePerms>
                                                </tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            <Modal
                ref={modalAssignRole}
                headerTitle="Role Assignment"
                acceptTitle="Set Role"
                role={roleForAssign}
                onClose={()=>{
                    setUserForRoleAssign({})
                    setRoleForAssign({})
                }}
            >
                {userForRoleAssign && (
                    <>
                        <div className="row">
                            <div className="col-3">First Name: </div>
                            <div className="col-9">{userForRoleAssign.FirstName}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">Last Name: </div>
                            <div className="col-9">{userForRoleAssign.LastName}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">Email: </div>
                            <div className="col-9">{userForRoleAssign.EmailAddress}</div>
                        </div>
                        <div className="row">
                            <div className="col-3">ID: </div>
                            <div className="col-9"><pre className="text-warning">{userForRoleAssign.ID}</pre></div>
                        </div>
                        <div className="row">
                            <div className="col-4">Role to assign: </div>
                            <div className="col-8">
                                <select
                                    id="role_selector"
                                    className="form-control text-dark"
                                    onChange={(val)=>{
                                        setRoleForAssign({val:val.target.value});
                                        setAccept(modalAssignRole, val.target.value, setRole, userForRoleAssign, setUserForRoleAssign, setRoleForAssign)}
                                    }
                                    value={roleForAssign[0]}
                                    placeholder="Please select role"
                                >
                                    <option value="">Please select to set ...</option>
                                    <option value="dat_mgr">Data Sets Manager</option>
                                    <option value="prj_mgr">Project Manager</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div>)}

const mapStateToProps = (state) => ({
    projectID: getProjectId(state),
    project: getProjectDetail(state),
    projUsers: getProjectUsers(state),
    userAddFormVisibility: getProjectUserAddForm(state),
    organizations: getOrganizations(state)
})

const mapDispatchToProps = {
    gotoRoute: routerActions.navigateTo,
    changeAddVisibility: projectsActions.Creators.showUserAddForm,
    unassignUser: projectsActions.Creators.unassignUser,
    setRole: projectsActions.Creators.setRole
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUsersImpl)