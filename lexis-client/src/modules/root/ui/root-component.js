import React from "react"
import { connect } from "react-redux"
import { startsWithSegment, endsWithSegment } from "router5-helpers"

import { getRouteName } from "../../routing/routing-selectors"
import {
    ROUTE_ROOT,
    ROUTE_ORGANIZATION,
    ROUTE_ORGANIZATION_ASSIGN,
    ROUTE_ORGANIZATION_DETAIL,
    ROUTE_ORGANIZATIONS_CREATE,
    ROUTE_ORGANIZATIONS_EDIT,
    ROUTE_USER_PROFILE,
    ROUTE_USER_PROFILE_EDIT,
    ROUTE_USERS_LIST,
    ROUTE_USERS_CREATE,
    ROUTE_USERS_DETAIL,
    ROUTE_USERS_EDIT,
    ROUTE_DATA_SETS_LIST,
    ROUTE_DATA_SETS_DETAIL,
    ROUTE_DATA_SETS_FILELIST,
    ROUTE_DATA_SETS_ZIP,
    ROUTE_DATA_SETS_SEARCH,
    ROUTE_DATA_SETS_UPDATE_META,
    ROUTE_DATA_SETS_FILEUPLOAD,
    ROUTE_DATA_SETS_GRIDMAP_ADD,
    ROUTE_DATA_SETS_GRIDMAP_REMOVE,
    ROUTE_DATA_SETS_CREATE_EUDAT,
    ROUTE_DATA_SETS_STAGE,
    ROUTE_DATA_SETS_STAGE_DELETE,
    ROUTE_DATA_SETS_SSHFS_ADD,
    ROUTE_DATA_SETS_SSHFS_REMOVE,
    ROUTE_DATA_SETS_QUEUE,
    ROUTE_DATA_SETS_CREATEWIZARD,
    ROUTE_DATA_SETS_MULTI,
    ROUTE_DATA_SETS_REPLICATE,
    ROUTE_DATA_SETS_DUPLICATE,
    ROUTE_PROJECT_LIST,
    ROUTE_PROJECT_CREATE,
    ROUTE_PROJECT_DETAIL,
    ROUTE_PROJECT_EDIT,
    ROUTE_PROJECT_RESOURCE_CREATEAPPROVED,
    ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC,
    ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL,
    ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL,
    ROUTE_PROJECT_USAGE,
    ROUTE_WORKFLOWTEMPLATES_LIST,
    ROUTE_WORKFLOWS_LIST,
    ROUTE_WORKFLOWS_DETAIL,
    ROUTE_WORKFLOW_CREATE,
    ROUTE_WORKFLOWEXECUTIONS_LIST,
    ROUTE_WORKFLOWEXECUTION_CREATE,
    ROUTE_WORKFLOWEXECUTION_DETAIL,
    ROUTE_PROJECT_USERS_MANAGEMENT,
    ROUTE_DATA_SETS_EDITOR_FILE,
    ROUTE_DATA_SETS_QUEUE_REQ_ID,
} from "../../routing/routes"
import { RootTemplate } from "./root-template"
import { AboutPage } from "./about-page"
import { Organization } from "../../organizations/ui/organization"
import { OrganizationDetail } from "../../organizations/ui/organization-detail"
import { OrganizationAssign } from "../../organizations/ui/organization-assign"
import { OrganizationCreate } from "../../organizations/ui/organization-create"
import { OrganizationEdit } from "../../organizations/ui/organization-edit"
import { UserPage } from "../../user/ui/user-page"
import { UserPageEdit } from "../../user/ui/user-edit"
import { UsersList } from "../../users/ui/users-list"
import { UserCreate } from "../../users/ui/users-create"
import { UsersDetail } from "../../users/ui/users-detail"
import { UsersEdit } from "../../users/ui/users-edit"

import { DataSetsList } from "../../data-sets/ui/data-sets-list"
import { DataSetsDetail } from "../../data-sets/ui/data-sets-detail"
import { DataSetsFilelist } from "../../data-sets/ui/data-sets-filelist"
import { DataSetsZip } from "../../data-sets/ui/data-sets-zip"
import { DataSetsSearch } from "../../data-sets/ui/data-sets-search"
import { DataSetsMetadataUpdate } from "../../data-sets/ui/data-sets-metadata-update"
import { DataSetsFileUpload } from "../../data-sets/ui/data-sets-file-upload"

import { DataSetsGridmapAdd } from "../../data-sets/ui/data-sets-gridmap-add"
import { DataSetsGridmapRemove } from "../../data-sets/ui/data-sets-gridmap-remove"
import { DataSetsCreateEudat } from "../../data-sets/ui/data-sets-create-eudat"
import { DatasetsStage } from "../../data-sets/data-sets-stage/ui/data-sets-stage"
import { DataSetsStageDelete } from "../../data-sets/ui/data-sets-stage-delete"
import { DataSetsSshAdd } from "../../data-sets/ui/data-sets-sshfs-add"
import { DataSetsSshRemove } from "../../data-sets/ui/data-sets-sshfs-remove"
import { DataSetsQueue } from "../../data-sets/ui/data-sets-queue"
import DatasetsCreateWizardContainer from "../../data-sets/ui/create-dataset-wizard/data-sets-create-wizard-container"
import { DataSetsMulti } from "../../data-sets/ui/data-sets-multi"
import { DatasetsReplicaReplicate } from "../../data-sets/data-sets-replica/ui/data-sets-replica-replicate"
import { DatasetsDuplicate } from "../../data-sets/data-sets-duplicate/ui/data-sets-duplicate"

import { ProjectList } from "../../projects/ui/projects-list"
import { ProjectDetail } from "../../projects/ui/project-detail"
import { ProjectCreate } from "../../projects/ui/project-create"
import { ProjectEdit } from "../../projects/ui/project-edit"
import { ApprovedResourceRequestCreate } from "../../projects/resources-requests-forms/ui/resource-create-approved"
import { ResourceCreateDynamic } from "../../projects/resources-requests-forms/ui/resource-create-dynamic"
import { ResourcesRequestsDetail } from "../../projects/resources-requests-dynamic/ui/resources-requests-detail"
import { ApprovedResourcesRequestsDetail } from "../../projects/resources-requests-approved/ui/resources-requests-detail"
import { ProjectUsage } from "../../projects/ui/project-usage"
import { WorkflowTemplatesList } from "../../workflowTemplates/ui/workflowTemplates-list"
import { WorkflowsList } from "../../workflows/ui/workflows-list"
import { WorkflowsDetail } from "../../workflows/ui/workflows-detail"
import { WorkflowCreate } from "../../workflows/ui/workflow-create"
import { WorkflowExecutionCreate } from "../../workflowExecutions/ui/workflowExecution-create"
import { WorkflowExecutionsList } from "../../workflowExecutions/ui/workflowExecutions-list"
import { WorkflowExecutionDetail } from "../../workflowExecutions/ui/workflowExecution-detail"
import AuthCheckPermission from "../../auth/auth-check-perms"
import { getUserRole } from "../../auth/auth-selectors"
import ProjectUsersManagement from "../../projects/ui/project-users-management"
import DataSetsFileEditor from "../../data-sets/ui/content-readers/data-sets-file-editor"
import { getProjectId } from "../../projects/projects-selectors"
import { getDataSetDetailInternalID } from "../../data-sets/data-sets-selectors"
import { CheckAnyListDatPerms, CheckAnyReadDatPerms, CheckFineReadPermsComp, CheckFineWritePermsComp, CheckIAMReadPerms, HasAnyProjectList, CheckIAMWritePerms, CheckAnyProjWriteComp, CheckAnyWriteDatPerms, CheckAnyProjReadComp, checkAnyOrgWritePerms } from "../../auth/auth-check-fine-perms"
import { getUserFinePerms } from "../../auth/auth-selectors"
import { checkAnyProjWrite } from "../../auth/auth-check-fine-perms"
import { getOrganizationId } from "../../user/user-selectors"

const LoadedApplication = ({ route, userRole, datID, projID, perms }) => {
    if (route) {
        const startsWith = startsWithSegment(route)
        const endsWith = endsWithSegment(route)
        return (
            startsWith(ROUTE_ROOT) && (
                <RootTemplate>
                    {endsWith(ROUTE_ROOT) && <AboutPage />}
                    {endsWith(ROUTE_ORGANIZATION) && (
                        <AuthCheckPermission
                            children={<Organization />}
                            permissionName="read-organization"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_ORGANIZATION_ASSIGN) && (
                        <AuthCheckPermission
                            children={<OrganizationAssign />}
                            permissionName="create-organization"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_ORGANIZATION_DETAIL) && (
                        <AuthCheckPermission
                            children={<OrganizationDetail />}
                            permissionName="read-organization"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_ORGANIZATIONS_CREATE) && (
                        <AuthCheckPermission
                            children={<OrganizationCreate />}
                            permissionName="create-organization"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_ORGANIZATIONS_EDIT) && (
                        <AuthCheckPermission
                            children={<OrganizationEdit />}
                            permissionName="update-organization"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_USER_PROFILE) && <UserPage />}

                    {endsWith(ROUTE_USER_PROFILE_EDIT) && <UserPageEdit />}
                    {endsWith(ROUTE_USERS_DETAIL) && (
                        <AuthCheckPermission
                            children={<UsersDetail />}
                            permissionName="read-users"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_USERS_EDIT) && (
                        <UsersEdit />
                    )}
                    {endsWith(ROUTE_USERS_LIST) && (
                        <UsersList />
                    )}
                    {endsWith(ROUTE_USERS_CREATE) && (
                        <UserCreate />
                    )}

                    {endsWith(ROUTE_PROJECT_LIST) && (
                        <HasAnyProjectList
                            children={<ProjectList />}
                        />
                    )
                    }
                    {endsWith(ROUTE_PROJECT_DETAIL) && (
                        <CheckAnyProjReadComp
                            children={<ProjectDetail />}
                        />
                    )
                    }

                    {endsWith(ROUTE_PROJECT_USERS_MANAGEMENT) && (
                        <ProjectUsersManagement />
                    )
                    }

                    {endsWith(ROUTE_PROJECT_CREATE) && (perms && (checkAnyProjWrite(perms) || checkAnyOrgWritePerms(perms)) && <ProjectCreate />)}
                    
                    {endsWith(ROUTE_PROJECT_EDIT) && (
                        <CheckFineWritePermsComp
                            prjID={projID}
                            type='prj'
                        >
                            <ProjectEdit />
                        </CheckFineWritePermsComp>
                    )
                    }
                    {endsWith(ROUTE_PROJECT_USAGE) && (
                        <CheckFineReadPermsComp
                            prjID={projID}
                            type='prj'
                        >
                            <AuthCheckPermission
                                children={<ProjectUsage />}
                                permissionName="read-projects"
                                userRole={userRole}
                            />
                        </CheckFineReadPermsComp>
                    )
                    }

                    {endsWith(ROUTE_PROJECT_RESOURCE_CREATEAPPROVED) && (
                        <AuthCheckPermission
                            children={<ApprovedResourceRequestCreate />}
                            permissionName="create-projects-resources"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC) && (
                        <AuthCheckPermission
                            children={<ResourceCreateDynamic />}
                            permissionName="create-projects-resources"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL) && (
                        <AuthCheckPermission
                            children={<ResourcesRequestsDetail />}
                            permissionName="read-projects"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(
                        ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL
                    ) && (
                        <AuthCheckPermission
                            children={<ApprovedResourcesRequestsDetail />}
                            permissionName="read-projects"
                            userRole={userRole}
                        />
                    )}

                    {endsWith(ROUTE_DATA_SETS_LIST) && (
                        <DataSetsList />
                    )}
                    {endsWith(ROUTE_DATA_SETS_DETAIL) && (
                        <DataSetsDetail />
                    )}
                    {endsWith(ROUTE_DATA_SETS_FILELIST) && (
                        <DataSetsFilelist />
                    )}
                    {endsWith(ROUTE_DATA_SETS_ZIP) && (
                        <DataSetsZip />
                    )}
                    {endsWith(ROUTE_DATA_SETS_SEARCH) && (
                        <DataSetsSearch />
                    )}
                    {endsWith(ROUTE_DATA_SETS_UPDATE_META) && (
                        <AuthCheckPermission
                            children={<DataSetsMetadataUpdate />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_FILEUPLOAD) && (
                        <AuthCheckPermission
                            children={<DataSetsFileUpload />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_EDITOR_FILE) && (
                        <CheckAnyReadDatPerms
                            children={<DataSetsFileEditor />}
                            permissionName="read-datasets"
                            userRole={userRole}
                        />
                    )}

                    {endsWith(ROUTE_DATA_SETS_CREATE_EUDAT) && (
                        <AuthCheckPermission
                            children={<DataSetsCreateEudat />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_GRIDMAP_ADD) && (
                        <AuthCheckPermission
                            children={<DataSetsGridmapAdd />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_GRIDMAP_REMOVE) && (
                        <AuthCheckPermission
                            children={<DataSetsGridmapRemove />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_STAGE) && (
                        <CheckAnyReadDatPerms
                            children={<DatasetsStage />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_STAGE_DELETE) && (
                        <CheckAnyReadDatPerms
                            children={<DataSetsStageDelete />}
                            permissionName="read-datasets"
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_SSHFS_ADD) && (
                        <AuthCheckPermission
                            children={<DataSetsSshAdd />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_SSHFS_REMOVE) && (
                        <AuthCheckPermission
                            children={<DataSetsSshRemove />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {(
                        endsWith(ROUTE_DATA_SETS_QUEUE)
                        || endsWith(ROUTE_DATA_SETS_QUEUE_REQ_ID)
                    ) && (
                        <AuthCheckPermission
                            children={<DataSetsQueue />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_CREATEWIZARD) && (
                        <AuthCheckPermission
                            children={<DatasetsCreateWizardContainer />}
                            permissionName="write-datasets"
                            userRole={userRole}
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_MULTI) && (
                        <CheckAnyReadDatPerms
                            children={<DataSetsMulti />}
                            permissionName="read-datasets"
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_REPLICATE) && (
                        <CheckAnyReadDatPerms
                            children={<DatasetsReplicaReplicate />}
                            permissionName="read-datasets"
                        />
                    )}
                    {endsWith(ROUTE_DATA_SETS_DUPLICATE) && (
                        <CheckAnyReadDatPerms
                            children={<DatasetsDuplicate />}
                            permissionName="read-datasets"
                        />
                    )}
                    {endsWith(ROUTE_WORKFLOWTEMPLATES_LIST) && (
                        <CheckAnyProjWriteComp>
                            <CheckAnyWriteDatPerms>
                                <WorkflowTemplatesList />
                            </CheckAnyWriteDatPerms>
                        </CheckAnyProjWriteComp>
                    )}
                    {endsWith(ROUTE_WORKFLOWS_LIST) && (
                        <HasAnyProjectList
                            children={<WorkflowsList />}
                        />
                    )
                    }
                    {endsWith(ROUTE_WORKFLOWS_DETAIL) && (
                        <CheckAnyProjReadComp>
                            <WorkflowsDetail />
                        </CheckAnyProjReadComp>
                    )}
                    {endsWith(ROUTE_WORKFLOW_CREATE) && (
                        <CheckAnyProjWriteComp>
                            <CheckAnyWriteDatPerms>
                                <WorkflowCreate />
                            </CheckAnyWriteDatPerms>
                        </CheckAnyProjWriteComp>
                    )}
                    {endsWith(ROUTE_WORKFLOWEXECUTIONS_LIST) && (
                        <HasAnyProjectList
                            children={<WorkflowExecutionsList />}
                        />
                    )
                    }
                    {endsWith(ROUTE_WORKFLOWEXECUTION_DETAIL) && (
                        <CheckAnyProjWriteComp>
                            <CheckAnyWriteDatPerms>
                                <WorkflowExecutionDetail />
                            </CheckAnyWriteDatPerms>
                        </CheckAnyProjWriteComp>
                    )}
                    {endsWith(ROUTE_WORKFLOWEXECUTION_CREATE) && (
                        <CheckAnyProjWriteComp>
                            <CheckAnyWriteDatPerms>
                                <WorkflowExecutionCreate />
                            </CheckAnyWriteDatPerms>
                        </CheckAnyProjWriteComp>
                    )}
                </RootTemplate>
            )
        )
    } else {
        return false
    }
}

const RootComponentImpl = ({ route, userRole, projID, datID, perms }) => (
    <LoadedApplication route={route} userRole={userRole} projID={projID} datID={datID} perms={perms} />
)

const mapStateToProps = state => ({
    route: getRouteName(state),
    userRole: getUserRole(state),
    projID: getProjectId(state),
    datID: getDataSetDetailInternalID(state),
    perms: getUserFinePerms(state),
})

export const RootComponent = connect(mapStateToProps)(RootComponentImpl)
