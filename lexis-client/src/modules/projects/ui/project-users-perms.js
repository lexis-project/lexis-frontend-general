import React from 'react'
import { connect } from 'react-redux'
import { getUsersNormPermsPrj } from '../../auth/auth-selectors'

const mapStateToPropsUserPerms = (state, ownProps) => ({
    normPerms: getUsersNormPermsPrj(state, ownProps)
})

const UserPermsImpl = ({normPerms}) => (
    <>
        <td>{normPerms && (normPerms.datasetAccess?'yes':'no')}</td>
        <td>{normPerms && (normPerms.datasetCreate?'yes':'no')}</td>
        <td>{normPerms && (normPerms.datasetPublicCreate?'yes':'no')}</td>
        <td>{normPerms && (normPerms.projectManager?'yes':'no')}</td>
        <td>{normPerms && (normPerms.workflowManager?'yes':'no')}</td>
    </>
)
export default connect(mapStateToPropsUserPerms)(UserPermsImpl)
