import conf from "../../config"

const { rolesConstraints } = conf

const permissions = {
    0: 'read-workflows',
    1: 'update-workflows',
    2: 'remove-workflows',
    3: 'create-workflows',
    4: 'read-users',
    5: 'create-users',
    6: 'update-users',
    7: 'remove-users',
    8: 'read-projects',
    9: 'create-projects',
    10: 'update-projects',
    11: 'remove-projects',
    12: 'create-projects-resources',
    13: 'read-organization',
    14: 'create-organization',
    15: 'update-organization',
    16: 'read-datasets',
    17: 'read-workflows-execution',
    19: 'cancel-workflows-execution',
    20: 'create-workflows-execution',
    21: 'project-users-management',
    22: 'create-public-datasets',
    23: 'write-datasets'
}

const rolesConstraintsWithPermNames = Object.keys(rolesConstraints)
    .reduce((obj, key) => ({
        ...obj,
        [key]: {...rolesConstraints[key],
            perms: rolesConstraints[key].perms.map((permKey) => permissions[permKey])
        }
    }),{})

/**
 * 
 * @param {[String]} inheritedRoles
 * @param {String} permissionName
 * @returns {Boolean}
 */
function checkInherited(inheritedRoles, permissionName){
    for (let i = 0; i < inheritedRoles.length; i++){
        const role = inheritedRoles[i]
        if(rolesConstraintsWithPermNames[role] === undefined){
            return false
        }
        if(rolesConstraintsWithPermNames[role].perms.includes(permissionName)){
            return true
        }
        if(rolesConstraintsWithPermNames[role].parents !== undefined) {
            if(checkInherited(rolesConstraintsWithPermNames[role].parents)){ // recursion!!
                return true
            }
        }
    }



    return false
}

/**
 * Checks if user has right permissions
 * @param {Object} props
 * @param {string} props.permissionName
 * @param {string} props.userRole
 * @param {React.Component} props.children
 * @returns {boolean}
 */
export default ({
    permissionName,
    userRole,
    children }) => {
    if(rolesConstraintsWithPermNames[userRole] === undefined) {
        return false
    }
    if(rolesConstraintsWithPermNames[userRole].perms.includes(permissionName)){
        return (children ? children : true )
    }
    if(rolesConstraintsWithPermNames[userRole].parents !== undefined) {
        const i = checkInherited(rolesConstraintsWithPermNames[userRole].parents, permissionName)
        return i ? (children ? children : i ) : false
    }
    return false
}
