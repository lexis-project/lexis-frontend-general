import { connect } from 'react-redux'
import { getUserFinePerms } from './auth-selectors'
import {normPermGroups} from './auth-saga'
function giveProperProperty(type){
    switch (type) {
    case 'dat':
        return 'datasets'
    case 'dat_short':
        return 'datasetsShort'
    case 'dat_list':
        return 'datasetsList'
    case 'dat_list_short':
        return 'datasetsListShort'
    case 'prj':
        return 'projects'
    case 'prj_short':
        return 'projectsShort'
    case 'dat_pub':
        return 'datasetsPub'
    case 'dat_pub_short':
        return 'datasetsPubShort'
    case 'iam_write':
        return 'iamWrite'
    case 'iam_write_short':
        return 'iamWriteShort'
    case 'iam_list':
        return 'iamList'
    default:
        return 'projects'
    }
}

/**
 * true -> user has write acces, false -> user has read access, null or undefined -> user does not has access
 * @typedef {Object} Permissions
 * @property {{"": boolean}} datasets
 * @property {{"": boolean}} projects
 */

/**
 * @typedef {Object} CompProps
 * @property {string} prjID
 * @property {'dat'|'dat_short'|'prj'|'prj_short'|'dat_pub'|'dat_pub_short'} type default prj, when _short, then will be searched by project short name given in prjID
 * @property {React} defChildren
 */

const mapStateToProps = (state) => ({
    /**
     * @type {Permissions}
     */
    perms: getUserFinePerms(state)
})

/**
 * @param {string} prjID
 * @param {'dat'|'dat_short'|'prj'|'prj_short'|'dat_pub'|'dat_pub_short'} type default prj, when _short, then will be searched by project short name given in prjID
 * @param {Permissions} perms
 */
export function checkFineWritePerms(prjID, type, perms) {
    return perms[giveProperProperty(type)][prjID] === true
}

/**
 * @type {<(prop0:CompProps)>}
 */
export const CheckFineWritePermsComp = connect(mapStateToProps)(
    ({prjID, type, children, perms, defChildren}) => perms && checkFineWritePerms(prjID, type, perms) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {string} prjID
 * @param {'dat'|'dat_short'|'prj'|'prj_short'|'dat_pub'|'dat_pub_short'} type default prj, when _short, then will be searched by project short name given in prjID
 * @param {Permissions} perms
 */
export function checkFineReadPerms(prjID, type, perms, access) {
    const property = giveProperProperty(type)
    const value = perms[property][prjID]
    const permAccess = value === false || value === true
    return access ? (access === 'public' || permAccess ) :  permAccess
}

/**
 * @type {<(prop0:CompProps)>}
 */
export const CheckFineReadPermsComp = connect(mapStateToProps)(
    ({prjID, type, children, perms, defChildren, access}) => (perms) && 
	( checkFineReadPerms(prjID, type, perms, access)) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkAnyReadDatPerms(perms) {
    const value = perms['datasets']
    for (const prj in value) {
        const perm = value[prj]
        if(perm === false || perm === true)
            return true
    }  
    return false
}

/**
 * @type {<(prop0:CompProps)>}
 */
export const CheckAnyReadDatPerms = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkAnyReadDatPerms(perms) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 * @returns {Boolean}
 */
export function checkAnyWriteDatPerms(perms) {
    const value = perms['datasets']
    for (const prj in value) {
        const perm = value[prj]
        if(perm === true)
            return true
    }  
    return false
}

/**
 * @type {<(prop0:CompProps)>}
 */
export const CheckAnyWriteDatPerms = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkAnyWriteDatPerms(perms) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkAnyListDatPerms(perms) {
    const value = perms['datasetsList']
    for (const prj in value) {
        const perm = value[prj]
        if(perm === true)
            return true
    }  
    return false
}

/**
 * @type {<(prop0:CompProps)>}
 */
export const CheckAnyListDatPerms = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkAnyListDatPerms(perms) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkIAMReadPerms(perms, orgID) {
    const value = perms.iam
    return value[orgID] === true || value[orgID] === false
}

/**
 */
export const CheckIAMReadPerms = connect(mapStateToProps)(
    ({children, perms, defChildren, orgID}) => perms && checkIAMReadPerms(perms, orgID) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkIAMListPerms(perms) {
    const value = perms.iamList
    return value === true
}

/**
 */
export const CheckIAMListPerms = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkIAMListPerms(perms) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkIAMWritePerms(perms, orgID) {
    const value = perms.iam
    return value[orgID] === true
}

/**
 */
export const CheckIAMWritePerms = connect(mapStateToProps)(
    ({children, perms, defChildren, orgID}) => perms && checkIAMWritePerms(perms, orgID) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkAnyOrgWritePerms(perms) {
    for (const key in perms.org) {
        if (perms.org[key] === false || perms.org[key] === true)
            return true
    }
    return false
}

/**
 */
export const CheckAnyOrgWritePerms = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkAnyOrgWritePerms(perms) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function checkOrgWritePerms(perms, orgID) {
    const value = perms.org[orgID]
    return value === true
}

/**
 */
export const CheckOrgWritePerms = connect(mapStateToProps)(
    ({children, perms, defChildren, orgID}) => perms && checkOrgWritePerms(perms, orgID) ? children : (defChildren ? defChildren : null)
)

/**
 * @param {Permissions} perms
 */
export function hasAnyProjectList(perms) {
    return Object.keys(perms.projects).length >= 0
}

export const HasAnyProjectList = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && hasAnyProjectList(perms) ? children : (defChildren ? defChildren : null)
)

/**
* @param {Permissions} perms
* @returns {Boolean}
*/
export function checkAnyProjWrite(perms) {
    for (const key in perms.projects) {
        if (perms.projects[key] === true)
            return true
    }
    return false
}

/**
* @param {Permissions} perms
* @returns {Boolean}
*/
export function checkAnyProjRead(perms) {
    for (const key in perms.projects) {
        if (perms.projects[key] === false || perms.projects[key] === true)
            return true
    }
    return false
}

/**
 */
export const CheckAnyProjWriteComp = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkAnyProjWrite(perms) ? children : (defChildren ? defChildren : null)
)

/**
 */
export const CheckAnyProjReadComp = connect(mapStateToProps)(
    ({children, perms, defChildren}) => perms && checkAnyProjRead(perms) ? children : (defChildren ? defChildren : null)
)

export const getUserPermsByProjectId = (prjId, perms) => {
    const normedPerms = normPermGroups(perms, '', '')
    const access = {
        datasetAccess : checkFineReadPerms(prjId, 'dat', normedPerms),
        datasetCreate : checkFineWritePerms(prjId, 'dat',normedPerms),
        datasetPublicCreate: checkFineWritePerms(prjId, 'dat_pub', normedPerms),
        projectManager: checkFineWritePerms(prjId, 'prj', normedPerms),
        workflowManager: false,
    }
    access.workflowManager = access.datasetCreate && access.projectManager
    return access
}
