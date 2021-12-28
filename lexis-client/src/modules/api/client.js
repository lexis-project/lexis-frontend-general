import axios from "axios"
import { compose } from "redux"
import config from "../../config"
import { Upload as TusUpload } from "tus-js-client"
import FormData from "form-data"

import { ServerErrorException } from "./exceptions/server-error-exception"
import { NotFoundException } from "./exceptions/not-found-exception"
import { MalformedRequestException } from "./exceptions/malformed-request-exception"
import { getAuthorization } from "../auth/auth-credentials"
import { UnauthorizedException } from "./exceptions/unauthorized-exception"
import { normalizeTargetPath } from "../utils"
import { TokenExpired } from "./exceptions/token-expired"

export const client = axios.create({
    baseURL: `${config.url.api}/api/v0.2`,
})

export const extractResponse =
    fn =>
        async (...args) => {
            const result = await fn(...args)
            if (result !== undefined) {
                return result
            } else {
                throw new ServerErrorException(
                    "API: Unexpected response of the server."
                )
            }
        }

export const safeResponseOr40X =
    fn =>
        async (...args) => {
            try {
                const response = await fn(...args)
                return response
            } catch (ex) {
                if (ex.response && ex.response.status) {
                    switch (ex.response.status) {
                    case 500:
                        console.error(ex.response)
                        throw new ServerErrorException(
                            "API: Internal server error. " + ex.response.data
                        )
                    case 503:
                        console.error(ex.response)
                        throw new ServerErrorException(
                            "API: Back-end service down (503). " +
                                ex.response.data
                        )
                    case 403:
                        return ex.response
                    case 401:
                        console.error(ex.response)
                        throw new ServerErrorException(
                            "API: Unauthorized at URL " + ex.response.config.url
                        )
                    case 404:
                        return ex.response
                    case 406:
                        console.warn(ex.response)
                        throw new NotFoundException(
                            "API: Requesting non existing data. " +
                                ex.response.data
                        )
                    case 400:
                        return ex.response
                    default:
                        console.warn(ex.response)
                        throw new ServerErrorException(
                            "API: Unspecified error. " + ex.response.data
                        )
                    }
                }
            }
        }

export const safeResponse =
    fn =>
        async (...args) => {
            try {
                const response = await fn(...args)
                return response
            } catch (ex) {
                if (ex.response && ex.response.status) {
                    const errorStringorEmpty = ex.response.data.errorString
                        ? ex.response.data.errorString
                        : ""
                    let dataMessage = ex.response.data.message
                        ? ex.response.data.message
                        : errorStringorEmpty

                    if (ex.response.data.message === "token no longer valid") {
                        throw new TokenExpired()
                    }
                    switch (ex.response.status) {
                    case 500:
                        console.error(ex.response)
                        throw new ServerErrorException(
                            "API: Internal server error. " + errorStringorEmpty
                        )
                    case 503:
                        console.error(ex.response)
                        throw new ServerErrorException(
                            "API: Back-end service down (503). " +
                                ex.response.data.errorSring
                        )
                    case 403:
                        console.error(ex.response)
                        throw new ServerErrorException(
                            "API: User not authorized to perform action (403). " +
                                errorStringorEmpty
                        )
                    case 400:
                        console.error(ex.response)
                        throw new MalformedRequestException(
                            "API: Malformed Request (400). " + dataMessage
                        )
                    case 401:
                        console.error(ex.response)
                        throw new UnauthorizedException(
                            "API: Unauthorized at URL " + ex.response.config.url
                        )
                    case 404:
                        console.error(ex.response)
                        throw new NotFoundException(
                            "API: Requesting non existing URL in client. " +
                                ex.response.config.url +
                                "; " +
                                ex.response.config.method
                        )
                    case 406:
                        console.warn(ex.response)
                        throw new NotFoundException(
                            "API: Requesting non existing data. " +
                                errorStringorEmpty
                        )
                    case 409:
                        console.warn(ex.response)
                        throw new MalformedRequestException(
                            "API: Conflict (409). " + errorStringorEmpty
                        )
                    case 422:
                        console.warn(ex.response)
                        return ex.response
                    default:
                        console.warn(ex.response)
                        throw new ServerErrorException(
                            "API: Unspecified error. " + errorStringorEmpty
                        )
                    }
                }
            }
        }

// organizations
export const updateOrganization = compose(
    extractResponse,
    safeResponse
)((Id, data) =>
    client.put(`/organization/${Id}`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

export const createOrganization = compose(safeResponse)(data =>
    client.post(`/organization`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

export const deleteOrganization = compose(safeResponse)(Id =>
    client.delete(`/organization/${Id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const listOrganizations = compose(
    extractResponse,
    safeResponse
)((all) =>
    client.get(`/organization`, {
        headers: { Authorization: getAuthorization() },
        params:{
            scope: all ? 'ALL' : 'OWN'
        }
    })
)

export const getOrganization = compose(
    extractResponse,
    safeResponse
)(Id =>
    client.get(`/organization/${Id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

// users
export const listUsers = compose(
    extractResponse,
    safeResponse
)((project, scopeAll, perms) => {
    let params = {}
    if (project) {params.project = project}
    if(scopeAll) {params.scope = 'ALL'}
    if(perms) {params.permissions = true}
    return client.get(`/user`, {
        params,
        headers: { Authorization: getAuthorization() },
    })
})

export const updateUsers = compose(
    extractResponse,
    safeResponse
)((id, data) =>
    client.put(`/user/${id}`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

export const createUsers = compose(safeResponse)(data =>
    client.post(`/user`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

export const deleteUsers = compose(safeResponse)(id =>
    client.delete(`/user/${id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const getUser = compose(
    extractResponse,
    safeResponse
)(id =>
    client.get(`/user/${id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const assignUserToProject = compose(
    extractResponse,
    safeResponse
)((prjID, userID) =>
    client.put(`/project/${prjID}/user/${userID}`, undefined, {
        headers: { Authorization: getAuthorization() },
    })
)

export const assignUserToOrganization = compose(
    extractResponse,
    safeResponse
)((orgID, userID) =>
    client.put(`/project/${orgID}/${userID}`, undefined, {
        headers: { Authorization: getAuthorization() },
    })
)

// datasets

export const listDataSets = compose(
    extractResponse,
    safeResponse
)(metadataQuery =>
    client.post("/dataset/search/metadata", metadataQuery, {
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

export const deleteDataSetsByMetadata = compose(
    extractResponse,
    safeResponse
)(metadataQuery =>
    client.delete("/dataset/search/metadata", {
        data: metadataQuery,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

export const filelistDataSet = compose(
    extractResponse,
    safeResponse
)((internalID, access, projectShortName, zone) =>
    client.post(
        "/dataset/listing",
        {
            internalID,
            access,
            project: projectShortName,
            recursive: true,
            zone,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const requestPID = compose(
    extractResponse,
    safeResponse
)((source_system, source_path, parent_pid) =>
    client.post(
        "/dataset/pid/assign",
        {
            source_system,
            source_path,
            parent_pid,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const requestDatasetReplica = compose(
    extractResponse,
    safeResponse
)((source_system, target_system, source_path, target_path) =>
    client.post(
        "/dataset/replicate",
        {
            source_system: source_system,
            target_system: target_system,
            source_path: source_path,
            target_path: target_path,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const queryDatasetReplicationStatus = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/replicate/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const requestDatasetDuplicate = compose(
    extractResponse,
    safeResponse
)((source_system, target_system, source_path, target_path, title) =>
    client.post(
        "/dataset/duplicate",
        {
            source_system: source_system,
            target_system: target_system,
            source_path: source_path,
            target_path: target_path,
            title: title,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const queryDatasetDuplicationStatus = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/duplicate/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const deleteDataSet = compose(
    extractResponse,
    safeResponse
)((internalID, access, projectShortName, path) =>
    client.delete("/dataset", {
        data: {
            internalID,
            access,
            project: projectShortName,
            path,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

/* FIXME we get available staging zones from config file for now; therefo this call is commented
export const getStagingZones = compose(
    extractResponse,
    safeResponse
)(() =>
    client.get("/dataset/staging/info", {
        headers: { Authorization: getAuthorization() },
    })
)
*/

//dataset content (zip)

export const downloadDataSet = compose(safeResponse)(
    /**
     *
     * @param {string} internalID
     * @param {DSAccess} access
     * @param {string} project
     * @param {string} zone
     * @param {string} path
     * @param {'file'|'zip'} archivetype
     * @param {downloadStatusListener} downloadStatusListener
     * @returns
     */
    (
        internalID,
        access,
        project,
        zone,
        path,
        archivetype,
        downloadStatusListener
    ) =>
        client.post(
            "/dataset/download",
            {
                internalID,
                access,
                project,
                path: normalizeTargetPath(path),
                archivetype: archivetype ? archivetype : "zip",
                zone,
            },
            {
                responseType: "blob",
                headers: {
                    Authorization: getAuthorization(),
                    Accept: "application/octet-stream",
                },
                onDownloadProgress: downloadStatusListener,
            }
        )
)

export const updateDataSetMetadata = compose(
    extractResponse,
    safeResponse
)((location, metadata) =>
    client.post(
        "/dataset",
        {
            push_method: "empty",
            internalID: location.internalID,
            access: location.access,
            project: location.project,
            metadata: metadata,
            zone: location.zone,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const postCreateDataset = compose(safeResponse)(
    /**
     *
     * @param {'directupload'|'tus'|'empty'} pushMethod
     * @param {string} path string or undefined
     * @param {string} fileName string or undefined
     * @param {string} fileContent string in base64 of file content or undefined
     * @param {'file'|'zip'} fileType string or undefined
     * @param {string} internalID just when updating existing dataset, otherwise undefined
     * @param {'public'|'project'|'user'} access
     * @param {string} projectShortName
     * @param {{}} metadata
     * @param {boolean} encryption
     * @param {boolean} compression
     * @param {string} zone
     * @param {Function} uploadStatusListener
     */
    (
        pushMethod,
        path,
        fileName,
        fileContent,
        fileType,
        internalID,
        access,
        projectShortName,
        metadata,
        encryption,
        compression,
        zone,
        uploadStatusListener
    ) => {
        const reqBody = {
            push_method: pushMethod,
            compress_method: fileType ? fileType : "file",
            access,
            project: projectShortName,
            zone,
            enc: encryption,
            comp: compression,
            internalID,
            path: path === "/" ? "" : path,
            name: fileName,
            metadata,
            file: fileContent,
        }
        return client.post("/dataset", reqBody, {
            headers: { Authorization: getAuthorization() },
            onUploadProgress: uploadStatusListener,
        })
    }
)

// FIXME: uncomment after tus upload issue investigated by Ruben
// export const TUSRetryDelays = [3000, 5000, 15000, 15000, 20000]
export const TUSRetryDelays = []

/**
 * @param {Blob} file
 * @param {string} internalID just when updating existing dataset, otherwise undefined
 * @param {string} project
 * @param {string} zone
 * @param {string} access
 * @param {string} username
 * @param {Function} uploadStatusListener
 * @param {Function} onShouldRetryHandler
 */
export const uploadDatasetTUS = (
    file,
    internalID,
    project,
    zone,
    access,
    username,
    uploadStatusListener,
    errorHandler,
    onShouldRetryHandler
) => {
    const chunkSize = config.DSzonesBodySizeLimit[zone]
        ? config.DSzonesBodySizeLimit[zone]
        : Infinity
    const TUSinstance = new TusUpload(file, {
        endpoint: config.url.datasetTus,
        retryDelays: TUSRetryDelays,
        chunkSize,
        metadata: {
            filename: file.name,
            internalID,
            project,
            access,
            user: username,
            zone,
        },
        headers: {
            Authorization: getAuthorization(),
        },
        onProgress: uploadStatusListener,
        onError: errorHandler,
        onShouldRetry: onShouldRetryHandler,
    })
    TUSinstance.start()
    return TUSinstance
}
/**
 * @deprecated
 */
export const uploadDataset = compose(
    extractResponse,
    safeResponseOr40X
)((type, file, name, location, push_method, metadata, path) => {
    let headers = {
        "Content-Type": "application/json",
        Authorization: getAuthorization(),
    }
    if (type === "zip") {
        return client.post(
            "/dataset",
            {
                push_method: push_method,
                access: location.access,
                project: location.project,
                internalID: location.internalID,
                metadata: metadata,
                compress_method: "zip",
                file: file,
                path: path,
            },
            {
                headers: headers,
            }
        )
    } else if (type === "file") {
        return client.post(
            "/dataset",
            {
                push_method: push_method,
                access: location.access,
                project: location.project,
                internalID: location.internalID,
                metadata: metadata,
                compress_method: "file",
                file: file,
                name: name,
                path: path,
            },
            {
                headers: headers,
            }
        )
    } else {
        return client.post(
            "/dataset",
            {
                push_method: "empty",
                access: location.access,
                project: location.project,
                internalID: location.internalID,
                metadata: metadata,
                compress_method: "file",
            },
            {
                headers: headers,
            }
        )
    }
})

// wp3 gridmap API

export const gridmapAdd = compose(
    extractResponse,
    safeResponseOr40X
)(({ dn, user }) =>
    client.post(
        "/dataset/gridftp/gridmap",
        { dn: dn, user: user },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const gridmapRemove = compose(
    extractResponse,
    safeResponseOr40X
)(({ user }) =>
    client.delete("/dataset/gridftp/gridmap", {
        data: { user: user },
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

// wp3 stage api
export const stageDataset = compose(
    extractResponse,
    safeResponse
)(
    (
        source_system,
        target_system,
        source_path,
        target_path,
        enc,
        compr,
        metadata
    ) =>
        client.post(
            "/dataset/staging/stage",
            {
                source_system: source_system,
                target_system: target_system,
                source_path: source_path,
                target_path: target_path,
                encryption: enc,
                compression: compr,
                metadata: metadata,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: getAuthorization(),
                },
            }
        )
)

export const stageDeleteDataset = compose(
    extractResponse,
    safeResponse
)((target_system, target_path) =>
    client.delete("/dataset/staging/delete", {
        data: { target_system, target_path },
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

/**
 * @deprecated
 */
export const datasetDatasize = compose(
    extractResponse,
    safeResponse
)(({ target_system, target_path }) =>
    client.post(
        "/dataset/data/size",
        { target_system: target_system, target_path: target_path },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const queryStageDataset = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/staging/stage/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const queryStageDeleteDataset = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/staging/delete/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const queryPID = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/pid/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const queryReplicate = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/replicate/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const queryDuplication = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/duplication/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const queryDatasize = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/data/size/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

/**
 * @deprecated
 */
export const getDsSizeID = compose(safeResponse)(data =>
    client.post(`/dataset/data/size`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

export const sshAdd = compose(
    extractResponse,
    safeResponseOr40X
)(({ host, pubkey, path }) =>
    client.post(
        "/dataset/ssh/sshfsexport",
        { host: host, pubkey: pubkey, path: path },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const sshRemove = compose(
    extractResponse,
    safeResponseOr40X
)(({ user, path }) =>
    client.delete("/dataset/ssh/sshfsexport", {
        data: { user: user, path: path },
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
        },
    })
)

export const multipart = compose(
    extractResponse,
    safeResponseOr40X
)(({ source_system, source_path, size }) =>
    client.post(
        "/dataset/compress/zip",
        { source_system: source_system, source_path: source_path, size: size },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
            },
        }
    )
)

export const queryMultipart = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/compress/zip/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const dataSize = compose(
    extractResponse,
    safeResponse
)((targetSystem, targetPath) =>
    client.post(
        "/dataset/data/size",
        { target_system: targetSystem, target_path: targetPath },
        {
            headers: {
                Authorization: getAuthorization(),
            },
        }
    )
)

export const queryDataSize = compose(
    extractResponse,
    safeResponse
)(requestID =>
    client.get("/dataset/data/size/" + requestID, {
        headers: { Authorization: getAuthorization() },
    })
)

export const stagedownload = compose(
    extractResponse,
    safeResponseOr40X
)(({ source_system, source_path }, chan) =>
    client.post(
        "/dataset/staging/download",
        { source_system: source_system, source_path: source_path },
        {
            onDownloadProgress: progressEvent =>
                chan.put({
                    target_system: source_system,
                    target_path: source_path,
                    loaded: progressEvent.loaded,
                    total: progressEvent.total,
                    lengthComputable: progressEvent.lengthComputable,
                }),
            headers: {
                "Content-Type": "application/json",
                Authorization: getAuthorization(),
                Accept: "application/octet-stream",
            },
            responseType: "blob", //https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
        }
    )
)

// projects
export const listProjects = compose(
    extractResponse,
    safeResponse
)(() => {
    return client.get(`/project`, {
        headers: { Authorization: getAuthorization() },
    })
})

export const getProject = compose(
    extractResponse,
    safeResponse
)(id =>
    client.get(`/project/${id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const createProject = compose(safeResponse)(data =>
    client.post(`/project`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

export const updateProject = compose(
    extractResponse,
    safeResponse
)((id, data) =>
    client.put(`/project/${id}`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

export const addRoleToUser = compose(
    extractResponse,
    safeResponse
)((userID, organizationID, projectID, projectShortName, role) =>
    client.post(`/authz/${userID}/add/${role}`, undefined, {
        headers: { Authorization: getAuthorization() },
        params: {
            organizationID,
            projectID,
            projectShortName,
        },
    })
)

/* RESOURCE REQUESTS */
// APPROVED resource requests POST
export const createHPCApprovedResourceRequest = compose(safeResponse)(data =>
    client.post(`/approval_system/approvedResourceRequest`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

// APPROVED resource request sent back from Approval GET
export const listHPCApprovedResourcesRequests = compose(
    extractResponse,
    safeResponse
)(LEXISProjectId =>
    client.get(
        `/approval_system/projectApprovedResourceRequest/${LEXISProjectId}`,
        {
            headers: { Authorization: getAuthorization() },
        }
    )
)

// GET specific APPROVED resources request by its ID
export const getApprovedResourcesRequestById = compose(
    extractResponse,
    safeResponse
)(HPCResourceId =>
    client.get(`/approval_system/approvedResourceRequest/${HPCResourceId}`, {
        headers: { Authorization: getAuthorization() },
    })
)

// DYNAMIC resource requests POST
export const createHPCResource = compose(safeResponse)(data =>
    client.post(`/approval_system/resourceRequest`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

// GET DYNAMIC resource requests by Project ID
export const listHPCResourcesRequests = compose(
    extractResponse,
    safeResponse
)(lexisProjectID =>
    client.get(`/approval_system/projectResourceRequest/${lexisProjectID}`, {
        headers: { Authorization: getAuthorization() },
    })
)

// GET specific DYNAMIC resources request by its ID
export const getResourcesRequestById = compose(
    extractResponse,
    safeResponse
)(HPCResourceRequestID =>
    client.get(`/approval_system/resourceRequest/${HPCResourceRequestID}`, {
        headers: { Authorization: getAuthorization() },
    })
)

// dynamic allocation resources
export const listDynamicResourcesSelection = compose(
    extractResponse,
    safeResponse
)(() =>
    client.get(`/approval_system/resource`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const getProjectUsage = compose(
    extractResponse,
    safeResponse
)(id =>
    client.get(`/accounting/${id}/usage`, {
        headers: { Authorization: getAuthorization() },
    })
)

// project's users
export const listProjectUsersAll = compose(
    extractResponse,
    safeResponse
)(qs =>
    client.get(`/user`, qs, {
        headers: { Authorization: getAuthorization() },
    })
)

export const createProjectUser = compose(
    extractResponse,
    safeResponse
)(data =>
    client.post(`/projectusers`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

// endpoint to get core spent hours aka "usageManagement - Actions relating to management of Cyclops usage"; also GET usages/amount/size of resources info of the given project from accounting service
export const getProjectAccountingData = compose(
    extractResponse,
    safeResponse
)((lexisProjectID, usageFrom, usageTo) =>
    client.get(`/accounting/${lexisProjectID}/usage`, {
        headers: { Authorization: getAuthorization() },
        params: {
            from: usageFrom,
            to: usageTo,
        },
    })
)

// workflowTemplates
export const listWorkflowTemplates = compose(
    extractResponse,
    safeResponse
)(() =>
    client.get(`/workflow/template`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const getWorkflowTemplates = compose(
    extractResponse,
    safeResponse
)(id =>
    client.get(`/workflow/template/${id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const uploadWorkflowTemplate = compose(safeResponse)(file => {
    const formData = new FormData()
    formData.append("workflowTemplateFile", file)

    return client.post(`/workflow/template/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getAuthorization(),
        },
    })
})

// workflows
export const listWorkflows = compose(
    extractResponse,
    safeResponse
)(() =>
    client.get(`/workflow`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const getWorkflows = compose(
    extractResponse,
    safeResponse
)(id =>
    client.get(`/workflow/${id}`, {
        headers: { Authorization: getAuthorization() },
    })
)

// For first version this will take only the name and workflodTempalteId
export const createWorkflow = compose(safeResponse)(data =>
    client.post(`/workflow`, data, {
        headers: { Authorization: getAuthorization() },
    })
)

// worklow execution - perhaps remove reqSize from portal-api and see if there is a way to create a table with a few pages
export const listWorkflowExecutions = compose(
    extractResponse,
    safeResponse
)(workflowId =>
    client.get(`/workflow/${workflowId}/execution?reqSize=10`, {
        headers: { Authorization: getAuthorization() },
    })
)

// For first version this will be changed to take all input parameters
export const createWorkflowExecution = compose(safeResponse)(
    /**
     *
     * @param {string} workflowId
     * @param {{isScheduledJob:boolean, isCronJob:boolean,isBatchJob:boolean, workflowTemplateId:string, inputFiles:{}, inputParameters: {}}} data
     * @returns
     */
    (workflowId, data) =>
        client.post(`/workflow/${workflowId}/execution`, data, {
            headers: { Authorization: getAuthorization() },
        })
)

export const createWorkflowExecutions = compose(safeResponse)(
    /**
     *
     * @param {string} workflowId
     * @param {[{isScheduledJob:boolean, isCronJob:boolean,isBatchJob:boolean, workflowTemplateId:string, inputFiles:{}, inputParameters: {}}]} data
     * @returns
     */
    (workflowId, data) =>
        client.post(`/workflow/${workflowId}/executions`, data, {
            headers: { Authorization: getAuthorization() },
        })
)

//This should be changed to remove the /status from endpoint, needs implemented in BE (portal and a4c interface)
export const getWorkflowExecution = compose(
    extractResponse,
    safeResponse
)((workflowId, workflowExecutionId) =>
    client.get(`/workflow/${workflowId}/execution/${workflowExecutionId}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const deleteWorkflow = compose(safeResponse)(workflowId =>
    client.delete(`/workflow/${workflowId}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const deleteWorkflowExecution = compose(safeResponse)(
    (workflowId, workflowExecutionId, data) =>
        client.post(
            `/workflow/${workflowId}/execution/${workflowExecutionId}/remove`,
            data,
            {
                headers: { Authorization: getAuthorization() },
            }
        )
)

export const getWorkflowExecutionLogs = compose(
    extractResponse,
    safeResponse
)((workflowId, workflowExecutionId) =>
    client.get(
        `/workflow/${workflowId}/execution/${workflowExecutionId}/logs`,
        {
            headers: { Authorization: getAuthorization() },
        }
    )
)

export const getWorkflowExecutionStatus = compose(
    extractResponse,
    safeResponse
)((workflowId, workflowExecutionId) =>
    client.get(
        `/workflow/${workflowId}/execution/${workflowExecutionId}/status`,
        {
            headers: { Authorization: getAuthorization() },
        }
    )
)

export const cancelWorkflowExecution = compose(safeResponse)(
    (workflowId, workflowExecutionId) =>
        client.delete(
            `/workflow/${workflowId}/execution/${workflowExecutionId}`,
            {
                headers: { Authorization: getAuthorization() },
            }
        )
)

export const listHPCresources = compose(
    extractResponse,
    safeResponse
)(() => {
    return client.get(`/hpc/resource`, {
        headers: { Authorization: getAuthorization() },
    })
})

export const getResource = compose(
    extractResponse,
    safeResponse
)(resourceId =>
    client.get(`/hpc/resource/${resourceId}`, {
        headers: { Authorization: getAuthorization() },
    })
)

export const listAvailableHeappeClusters = compose(
    extractResponse,
    safeResponse,
)((endpoint) => {
    return client.get('/heappe/ClusterInformation/ListAvailableClusters', {
        headers: { Authorization: getAuthorization() },
        params: {
            endpoint
        }
    })
})

export const getHeappeCommandTemplateParameters = compose(

)((username, endpoint, userScriptPath, commandTemplateID)  => {
    let params = {
        endpoint
    }
    if(username)
    {
        params.username=username
    }
    return client.post('/heappe/ClusterInformation/GetCommandTemplateParametersName',
        {
            UserScriptPath: userScriptPath,
            CommandTemplateID: commandTemplateID
        },
        {
            headers: { Authorization: getAuthorization() },
            params
        }
    )
})

// /heappe/ClusterInformation/ListAvailableClusters
