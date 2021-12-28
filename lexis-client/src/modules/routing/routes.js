export const ROUTE_ROOT = "root"
export const ROUTE_ERROR = "root.error"
export const ROUTE_ORGANIZATION = "root.organization"
export const ROUTE_ORGANIZATION_ASSIGN = "root.organization.assign"
export const ROUTE_ORGANIZATION_DETAIL = "root.organization.detail"
export const ROUTE_ORGANIZATIONS_EDIT = "root.organization.detail.edit"
export const ROUTE_ORGANIZATIONS_CREATE = "root.organization.create"
export const ROUTE_USER_PROFILE = "root.profile"
export const ROUTE_USER_PROFILE_EDIT = "root.profile.edit"
export const ROUTE_USERS_LIST = "root.users"
export const ROUTE_USERS_DETAIL = "root.users.detail"
export const ROUTE_USERS_CREATE = "root.users.create"
export const ROUTE_USERS_EDIT = "root.users.detail.edit"

// both of those allow access to /dataset (D) and (G)
// /search/metadata (G), showing only an overview
export const ROUTE_DATA_SETS_LIST = "root.datasets"
// /search/metadata (G), showing a specific dataset
export const ROUTE_DATA_SETS_DETAIL = "root.datasets.detail"
export const ROUTE_DATA_SETS_FILELIST = "root.datasets.filelist"
export const ROUTE_DATA_SETS_ZIP = "root.datasets.zip"
export const ROUTE_DATA_SETS_DELETE = "root.datasets.delete"
export const ROUTE_DATA_SETS_SEARCH = "root.datasets.search"
export const ROUTE_DATA_SETS_UPDATE_META = "root.datasets.updateMeta"
// /dataset P
export const ROUTE_DATA_SETS_FILEUPLOAD = "root.datasets.fileupload"
export const ROUTE_DATA_SETS_EDITOR_FILE = "root.datasets.fileEditor"
export const ROUTE_DATA_SETS_CERT = "root.datasets.cert"

export const ROUTE_DATA_SETS_CREATE_EUDAT = "root.datasets.create_eudat"
export const ROUTE_DATA_SETS_GRIDMAP_ADD = "root.datasets.gridmap_add"
export const ROUTE_DATA_SETS_GRIDMAP_REMOVE = "root.datasets.gridmap_remove"
export const ROUTE_DATA_SETS_STAGE = "root.datasets.detail.stage"
export const ROUTE_DATA_SETS_STAGE_DELETE = "root.datasets.detail.stage.delete"
export const ROUTE_DATA_SETS_SSHFS_ADD = "root.datasets.sshfs_add"
export const ROUTE_DATA_SETS_SSHFS_REMOVE = "root.datasets.sshfs_REMOVE"

export const ROUTE_DATA_SETS_QUEUE = "root.datasets.queue"
export const ROUTE_DATA_SETS_QUEUE_REQ_ID = "root.datasets.queue.reqid"
export const ROUTE_DATA_SETS_CREATE = "root.datasets.create"
export const ROUTE_DATA_SETS_CREATEWIZARD = "root.datasets.createwizard"
export const ROUTE_DATA_SETS_MULTI = "root.datasets.multi"

export const ROUTE_DATA_SETS_REPLICATE = "root.datasets.detail.replicate"
export const ROUTE_DATA_SETS_DUPLICATE = "root.datasets.detail.duplicate"

//apis to manage support, users and projects in irods not exposed but called in USERS and PROJECT as needed
//checkpermission?

export const ROUTE_PROJECT_LIST = "root.projects"
export const ROUTE_PROJECT_DETAIL = "root.projects.detail"
export const ROUTE_PROJECT_EDIT = "root.projects.detail.edit"
export const ROUTE_PROJECT_CREATE = "root.projects.create"
export const ROUTE_PROJECT_RESOURCE_LIST = "root.projects.detail.resources"
export const ROUTE_PROJECT_RESOURCE_REQUEST_LIST =
    "root.projects.detail.resourcesrequests"
export const ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL =
    "root.projects.detail.resourcesrequests.detail"
export const ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_LIST =
    "root.projects.detail.approvedresourcesrequests"
export const ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL =
    "root.projects.detail.approvedresourcesrequests.detail"
export const ROUTE_PROJECT_RESOURCE_CREATEAPPROVED =
    "root.projects.detail.resources.createapproved"
export const ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC =
    "root.projects.detail.resources.createdynamic"
export const ROUTE_PROJECT_USAGE = "root.projects.usage"
export const ROUTE_PROJECT_USERS_MANAGEMENT = "root.projects.detail.usersmanagement"
export const ROUTE_WORKFLOWTEMPLATES_LIST = "root.workflowTemplates"
export const ROUTE_WORKFLOWTEMPLATES_DETAIL = "root.workflowTemplates.detail"
export const ROUTE_WORKFLOWS_LIST = "root.workflows"
export const ROUTE_WORKFLOWS_DETAIL = "root.workflows.detail"
export const ROUTE_WORKFLOW_CREATE = "root.workflows.create"
export const ROUTE_WORKFLOWEXECUTIONS_LIST = "root.workflows.detail.workflowExecutions"
export const ROUTE_WORKFLOWEXECUTION_CREATE = "root.workflows.detail.workflowExecutions.create"
export const ROUTE_WORKFLOWEXECUTION_DETAIL = "root.workflows.detail.workflowExecutions.detail"

export const ROUTES = [
    {
        name: ROUTE_ROOT,
        path: "/",
    },
    {
        name: ROUTE_ORGANIZATION,
        path: "organization",
    },
    {
        name: ROUTE_ORGANIZATION_DETAIL,
        path: "/:Id",
    },
    {
        name: ROUTE_ORGANIZATION_ASSIGN,
        path: "/assign",
    },
    {
        name: ROUTE_ORGANIZATIONS_CREATE,
        path: "/new",
    },
    {
        name: ROUTE_ORGANIZATIONS_EDIT,
        path: "/edit",
    },
    {
        name: ROUTE_USERS_LIST,
        path: "users",
    },
    {
        name: ROUTE_USERS_DETAIL,
        path: "/:Id",
    },
    {
        name: ROUTE_USER_PROFILE,
        path: "profile",
    },
    {
        name: ROUTE_USERS_CREATE,
        path: "/new",
    },
    {
        name: ROUTE_USERS_EDIT,
        path: "/edit",
    },
    {
        name: ROUTE_USER_PROFILE_EDIT,
        path: "/edit",
    },
    {
        name: ROUTE_DATA_SETS_LIST,
        path: "datasets",
    },
    {
        name: ROUTE_DATA_SETS_DETAIL,
        path: "/:internalID",
    },
    {
        name: ROUTE_DATA_SETS_FILELIST,
        path: "/:internalID/FileList",
    },
    {
        name: ROUTE_DATA_SETS_ZIP, //download zip
        path: "/:internalID/Download",
    },
    {
        name: ROUTE_DATA_SETS_DELETE,
        path: "/:internalID/Delete",
    },
    {
        name: ROUTE_DATA_SETS_UPDATE_META,
        path: "/:internalID/UpdateMetadata",
    },
    {
        name: ROUTE_DATA_SETS_SEARCH,
        path: "/search",
    },
    {
        name: ROUTE_DATA_SETS_FILEUPLOAD,
        path: "/fileupload/:zone/:internalID/:dsPath/:access/:project",
    },
    {
        name: ROUTE_DATA_SETS_EDITOR_FILE,
        path: "/editor/:zone/:internalID/:dsPath/:fileName/:access/:project",
    },
    {
        name: ROUTE_DATA_SETS_CREATE_EUDAT,
        path: "/create_eudat",
    },
    {
        name: ROUTE_DATA_SETS_GRIDMAP_ADD,
        path: "/gridmap/add",
    },
    {
        name: ROUTE_DATA_SETS_GRIDMAP_REMOVE,
        path: "/gridmap/remove",
    },
    {
        name: ROUTE_DATA_SETS_STAGE,
        path: "/request_stage/:source_system",
    },
    {
        name: ROUTE_DATA_SETS_STAGE_DELETE,
        path: "/delete",
    },
    {
        name: ROUTE_DATA_SETS_SSHFS_ADD,
        path: "/sshfs/add",
    },
    {
        name: ROUTE_DATA_SETS_SSHFS_REMOVE,
        path: "/sshfs/remove",
    },
    {
        name: ROUTE_DATA_SETS_QUEUE,
        path: "/queue/:type", // dat_deletion | duplication | replication | staging | deletion | datasize | newPID
    },
    {
        name: ROUTE_DATA_SETS_QUEUE_REQ_ID,
        path: "/:reqID",
    },
    {
        name: ROUTE_DATA_SETS_CREATEWIZARD,
        path: "/createwizard",
    },
    {
        name: ROUTE_DATA_SETS_MULTI,
        path: "/download_multipart",
    },
    {
        name: ROUTE_DATA_SETS_REPLICATE,
        path: "/request_replica",
    },
    {
        name: ROUTE_DATA_SETS_DUPLICATE,
        path: "/request_duplicate"
    },
    {
        name: ROUTE_PROJECT_LIST,
        path: "projects",
    },
    {
        name: ROUTE_PROJECT_DETAIL,
        path: "/:id",
    },
    {
        name: ROUTE_PROJECT_CREATE,
        path: "/new",
    },
    {
        name: ROUTE_PROJECT_EDIT,
        path: "/edit",
    },
    {
        name: ROUTE_PROJECT_RESOURCE_LIST,
        path: "/resources",
    },
    {
        name: ROUTE_PROJECT_RESOURCE_REQUEST_LIST,
        path: "/resourcesrequests",
    },
    {
        name: ROUTE_PROJECT_RESOURCE_REQUEST_DETAIL,
        path: "/:resourceRequestId",
    },
    {
        name: ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_LIST,
        path: "/approvedresourcesrequests",
    },
    {
        name: ROUTE_PROJECT_APPROVED_RESOURCE_REQUEST_DETAIL,
        path: "/:resourceRequestId",
    },
    {
        name: ROUTE_PROJECT_RESOURCE_CREATEAPPROVED,
        path: "/newapproved",
    },
    {
        name: ROUTE_PROJECT_RESOURCE_CREATEDYNAMIC,
        path: "/newdynamic",
    },
    { name: ROUTE_PROJECT_USAGE, path: "/usage/:id" },
    {
        name: ROUTE_PROJECT_USERS_MANAGEMENT,
        path: "/users"
    },
    {
        name: ROUTE_WORKFLOWTEMPLATES_LIST,
        path: "workflow/template",
    },
    {
        name: ROUTE_WORKFLOWTEMPLATES_DETAIL,
        path: "/:workflowTemplateId",
    },
    {
        name: ROUTE_WORKFLOWS_LIST,
        path: "workflow",
    },
    {
        name: ROUTE_WORKFLOWS_DETAIL,
        path: "/:workflowId",
    },
    {
        name: ROUTE_WORKFLOW_CREATE,
        path: "/:workflowTemplateId/new",
    },
    {
        name: ROUTE_WORKFLOWEXECUTIONS_LIST,
        path: "/execution",
    },
    {
        name: ROUTE_WORKFLOWEXECUTION_CREATE,
        path: "/new",
    },
    {
        name: ROUTE_WORKFLOWEXECUTION_DETAIL,
        path: "/:workflowExecutionId",
    },
    {
        name: ROUTE_ERROR,
        path: "error/:eType",
    },
]
