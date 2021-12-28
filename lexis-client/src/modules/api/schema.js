import { omit } from "lodash"
import { schema } from "normalizr"

export const organization = new schema.Entity(
    "organizations",
    {}, // {} is shortcat for schema.Object
    {
        idAttribute: "ID",
    }
)
export const organizations = [organization] //organizations is array of organization

export const user = new schema.Entity(
    "users",
    {}, // {} is shortcat for schema.Object
    {
        idAttribute: "ID",
    }
)
export const users = [user]

export const dataset = new schema.Entity(
    "datasetsList",
    {}, // {} is shortcat for schema.Object
    {
        //"internalID"
        idAttribute:
            //    https://github.com/paularmstrong/normalizr/blob/master/docs/api.md
            value => value.location.internalID,
    }
)

export const datasets = [dataset]

export const datasetFilelist = new schema.Entity(
    "datasetsFilelist",
    {},
    {
        idAttribute: (value, parent, key) => value.internalID,
        processStrategy: value => omit(value, "internalID"),
    }
)

export const datasetZip = new schema.Entity(
    "datasetsZip",
    {},
    {
        idAttribute: (value, parent, key) => `${value.internalID}${value.path}`,
        processStrategy: value => omit(value, "internalID", "path"),
    }
)

export const datasetStatusList = new schema.Entity(
    "datasetStatusList",
    {},
    { idAttribute: (value, parent, key) => value.query }
)

export const DownloadMulti = new schema.Entity(
    "datasetDownloadMulti",
    {},
    { idAttribute: (value, parent, key) => value.source_path }
)

export const StageDownload = new schema.Entity(
    "datasetStageDownload",
    {},
    { idAttribute: (value, parent, key) => value.target_path }
)

export const resource = new schema.Entity(
    "resources",
    {},
    { idAttribute: "HPCResourceID" }
)

export const resources = [resource]

export const project = new schema.Entity(
    "projects",
    {},
    { idAttribute: "ProjectID" }
)

export const computerResource = new schema.Entity(
    "computerResources",
    {},
    {
        idAttribute: "Id",
    }
)

export const computerResources = [computerResource]

export const resourceRequest = new schema.Entity(
    "resourcesRequests",
    {},
    {
        idAttribute: "HPCResourceRequestID",
    }
)

export const resourceRequests = [resourceRequest]

export const approvedResourceRequest = new schema.Entity(
    "approvedResourceRequests",
    {},
    {
        idAttribute: "HPCResourceID",
    }
)

export const approvedResourceRequests = [approvedResourceRequest]

export const hpcResource = new schema.Entity(
    "hpcResources",
    {},
    {
        idAttribute: "HPCResourceID",
    }
)

export const hpcResources = [hpcResource]

export const projects = [project]

export const usage = new schema.Entity(
    "usage",
    {},
    { idAttribute: "ProjectID" }
)

export const usages = [usage]

export const workflowTemplate = new schema.Entity(
    "workflowTemplates",
    {},
    {
        idAttribute: "workflowTemplateID",
    }
)
export const workflowTemplates = [workflowTemplate]

export const workflow = new schema.Entity(
    "workflows",
    {},
    {
        idAttribute: "workflowID",
    }
)
export const workflows = [workflow]

export const workflowExecution = new schema.Entity(
    "workflowExecutions",
    {},
    {
        idAttribute: "workflowExecutionID",
    }
)
export const workflowExecutions = [workflowExecution]

export const workflowExecutionLogs = new schema.Entity(
    "workflowExecutionLogs",
    {},
    {
        idAttribute: "workflowExecutionId",
    }
)

export const workflowExecutionStepStatus = new schema.Entity(
    "workflowExecutionStepStatus",
    {},
    {
        idAttribute: "workflowExecutionId",
    }
)
