import {
    all,
    call,
    takeEvery,
    put,
    fork,
    select,
    cancel,
    take,
    delay,
    takeLatest,
} from "redux-saga/effects"
import { actions as routerActions } from "redux-router5"

import Actions from "./workflowExecutions-actions"
import {
    listWorkflowExecutions,
    createWorkflowExecution,
    getWorkflowExecution,
    getWorkflowExecutionLogs,
    getWorkflowExecutionStatus,
    cancelWorkflowExecution,
    deleteWorkflowExecution,
    getWorkflows,
    filelistDataSet,
    createWorkflowExecutions,
    listAvailableHeappeClusters,
    getHeappeCommandTemplateParameters,
} from "../api/client"
import { normalizeAndStore } from "../entity-repository/entity-repository-saga"
import {
    workflowExecutions as workflowExecutionsSchema,
    workflowExecution as workflowExecutionSchema,
    workflowExecutionLogs as workflowExecutionLogsSchema,
    workflowExecutionStepStatus as workflowExecutionStepStatusSchema,
    workflow as workflowSchema,
    datasetFilelist as datasetFilelistSchema,
} from "../api/schema"
import {
    ROUTE_WORKFLOWEXECUTIONS_LIST,
    ROUTE_WORKFLOWEXECUTION_CREATE,
    ROUTE_WORKFLOWEXECUTION_DETAIL,
} from "../routing/routes"
import { onRouteEnter, onRouteLeaveOnce } from "../routing/on-route-enter"
import {
    getWFDetailInputParameters,
    getWFDetailInputParameterValues,
    getWorkflowsDetail,
    getWorkflowsDetailId,
} from "../workflows/workflows-selectors"
import { getWorkflowExecutionDetailId } from "./workflowExecutions-selectors"
import {
    readApiSafely,
    createApiSafely,
    deleteApiSafely,
} from "../api/api-saga"
import { NotFoundException } from "../api/exceptions/not-found-exception"
import { ToastsStore } from "react-toasts"
import dataSetsActions from "../data-sets/data-sets-actions"
import { onDetail as wfOnDetail } from "../workflows/workflows-saga"
import {
    getDataSetsFilelist,
    getDataSetsList,
    getHpcResources,
} from "../entity-repository/entity-repository-selectors"
import {
    extractIntIDandPathFromStagePath,
    stagePath,
    waitForDatasetLoaded,
} from "../data-sets/data-sets-utils"
import { getUserFinePerms, getUserName } from "../auth/auth-selectors"
import { omit } from "lodash"
import { arrayPush, change, clearFields, destroy, getFormInitialValues } from "redux-form"
import { getForms } from "../root/root-selectors"
import { getFetchingStateOfDatasets } from "../data-sets/data-sets-selectors"
import { ROW_SEPARATOR, SEPARATOR } from "./workflowExecutions-batch"
import { checkFineWritePerms } from "../auth/auth-check-fine-perms"
import { fetchPrjResources } from "../projects/projects-saga"
import { GENERIC_TEMP_ID } from "../forms/heappe/heappe-task-templateParamVals-input-field"

function* onList() {
    try {
        yield put(Actions.Creators.listFetchStart())

        const workflowId = yield select(getWorkflowsDetailId)

        const workflowExecutions = yield call(
            readApiSafely,
            listWorkflowExecutions,
            workflowId
        )
        if (workflowExecutions) {
            const workflowExecutionIds = yield call(
                normalizeAndStore,
                workflowExecutions,
                workflowExecutionsSchema
            )

            yield put(Actions.Creators.listFetch(workflowExecutionIds))
        }

        yield put(Actions.Creators.listFetchSuccess())
    } catch (err) {
        console.error("Error in saga for listing workflow execcutions - ", err)
        yield put(Actions.Creators.listFetchError(err))
    }
}

function* onLogs() {
    try {
        yield put(Actions.Creators.logsFetchStart())

        const workflowId = yield select(getWorkflowsDetailId)
        const workflowExecutionId = yield select(getWorkflowExecutionDetailId)
        const workflowExecutionLogs = yield call(
            readApiSafely,
            getWorkflowExecutionLogs,
            workflowId,
            workflowExecutionId
        )
        if (workflowExecutionLogs) {
            yield call(
                normalizeAndStore,
                workflowExecutionLogs,
                workflowExecutionLogsSchema
            )
            yield put(Actions.Creators.logsFetch(workflowExecutionLogs))
        }
        yield put(Actions.Creators.logsFetchSuccess())
    } catch (err) {
        console.error(
            "Error in saga for getting workflow execcution logs - ",
            err
        )
        yield put(Actions.Creators.logsFetchError(err))
    }
}

function* onStatus() {
    try {
        yield put(Actions.Creators.statusFetchStart())

        const workflowId = yield select(getWorkflowsDetailId)
        const workflowExecutionId = yield select(getWorkflowExecutionDetailId)

        const workflowExecutionStepStatus = yield call(
            readApiSafely,
            getWorkflowExecutionStatus,
            workflowId,
            workflowExecutionId
        )
        if (workflowExecutionStepStatus) {
            yield call(
                normalizeAndStore,
                workflowExecutionStepStatus,
                workflowExecutionStepStatusSchema
            )

            yield put(Actions.Creators.statusFetch(workflowExecutionStepStatus))
        }
        yield put(Actions.Creators.statusFetchSuccess())
    } catch (err) {
        console.error(
            "Error in saga for getting workflow execcution step statuses - ",
            err
        )
        yield put(Actions.Creators.statusFetchError(err))
    }
}

function* onDetail() {
    try {
        yield put(Actions.Creators.wfeFetchStart())

        const workflowId = yield select(getWorkflowsDetailId)
        const workflowExecutionId = yield select(getWorkflowExecutionDetailId)

        const workflow = yield call(readApiSafely, getWorkflows, workflowId)
        yield call(normalizeAndStore, workflow, workflowSchema)
        const workflowExecution = yield call(
            readApiSafely,
            getWorkflowExecution,
            workflowId,
            workflowExecutionId
        )
        yield call(
            normalizeAndStore,
            workflowExecution,
            workflowExecutionSchema
        )

        yield put(Actions.Creators.wfeFetch(workflowExecution))
        yield put(Actions.Creators.wfeFetchSuccess())
    } catch (ex) {
        if (ex instanceof NotFoundException) {
            ToastsStore.warning("Requesting non-existing workflow execution")
            yield put(Actions.Creators.wfeFetchError(ex))
            yield put(routerActions.navigateTo(ROUTE_WORKFLOWEXECUTIONS_LIST))
        }
    }
}

function* onCreate({ data }) {
    const workflowId = yield select(getWorkflowsDetailId)
    const wfDetail = yield select(getWorkflowsDetail)
    const datPathInputParams = wfDetail.inputParameters.filter(
        p => p.isDataset === true || p.isDatasetPath === true
    )
    const datIdInputParams = wfDetail.inputParameters.filter(
        p => p.isDatasetId === true
    )
    try {
        yield put(Actions.Creators.createStart(true))

        // proccess dataset path and id

        const datasets = yield select(getDataSetsList)
        const username = yield select(getUserName)

        for (let i = 0; i < datPathInputParams.length; i++) {
            const param = datPathInputParams[i]
            if (
                data.inputParameters[`${param.inputParamName}_==datasetID`] ===
                    undefined ||
                data.inputParameters[`${param.inputParamName}_==datasetID`]
                    .value === undefined
            ) {
                throw new Error(
                    `Dataset id not specified. Field: "${param.inputParamName}"`
                )
            }
            const internalID =
                data.inputParameters[`${param.inputParamName}_==datasetID`]
                    .value
            const dataset = datasets[internalID]

            // Do not require selected file
            // if (
            //     param.isDatasetPath &&
            //     (data.inputParameters[
            //         `${param.inputParamName}_==datasetFilePath`
            //     ] === undefined ||
            //         data.inputParameters[
            //             `${param.inputParamName}_==datasetFilePath`
            //         ] === "")
            //     // do not check, if can be without the file
            // ) {
            //     throw new Error(
            //         `Dataset file path not specified. Field: "${param.inputParamName}"`
            //     )
            // }
            let finVal = stagePath(
                {
                    internalID,
                    access: dataset.location.access,
                    project: dataset.location.project,
                },
                username
            )

            const dPath = data.inputParameters[
                `${param.inputParamName}_==datasetFilePath`]

            if (param.isDatasetPath === true && dPath) {
                finVal = `${finVal}${
                    data.inputParameters[
                        `${param.inputParamName}_==datasetFilePath`
                    ]
                }`
            }
            // TODO: DDI does not accept / at the end of the path and because of multiple inputs types in wf template
            finVal =
                finVal[finVal.length - 1] === "/"
                    ? finVal.slice(0, finVal.length - 1)
                    : finVal

            data.inputParameters[param.inputParamName] = finVal
        }

        for (let i = 0; i < datIdInputParams.length; i++) {
            const param = datIdInputParams[i]
            if (
                data.inputParameters[`${param.inputParamName}_==datasetID`] ===
                    undefined ||
                data.inputParameters[`${param.inputParamName}_==datasetID`]
                    .value === undefined
            ) {
                throw new Error(
                    `Dataset id not specified. Field: "${param.inputParamName}"`
                )
            }
            const internalID =
                data.inputParameters[`${param.inputParamName}_==datasetID`]
                    .value
            if (
                param.isDatasetPath &&
                (data.inputParameters[
                    `${param.inputParamName}_==datasetFilePath`
                ] === undefined ||
                    data.inputParameters[
                        `${param.inputParamName}_==datasetFilePath`
                    ] === "")
            ) {
                throw new Error(
                    `Dataset file path not specified. Field: "${param.inputParamName}"`
                )
            }
            let finVal = internalID
            if (
                param.isDatasetPath === true &&
                dPath !== undefined
            ) {
                finVal = `${finVal}${dPath}`
            }
            // TODO: DDI does not accept / at the end of the path and because of multiple inputs types in wf template
            finVal =
                finVal[finVal.length - 1] === "/"
                    ? finVal.slice(0, finVal.length - 1)
                    : finVal

            data.inputParameters[param.inputParamName] = finVal
        }

        const processedData = {
            ...data,
            inputParameters: {
                ...omit(
                    data.inputParameters,
                    ...Object.keys(data.inputParameters).filter(
                        key =>
                            key.endsWith("_==datasetID") ||
                            key.endsWith("_==datasetFilePath")
                    )
                ),
            },
        }
        // rewrite [] to {} for empty map objects

        for (const k in wfDetail.inputParameters) {
            const field = wfDetail.inputParameters[k]
            if(field.inputParamType === 'map' && (!processedData.inputParameters[field.inputParamName] || processedData.inputParameters[field.inputParamName].length === 0))
            {
                processedData.inputParameters[field.inputParamName] = {}
            }else if(field.inputParamType === 'map')
            {
                const nMap = {}
                for(let i = 0; i < processedData.inputParameters[field.inputParamName].length; i++)
                {
                    nMap[processedData.inputParameters[field.inputParamName][i][0]] = processedData.inputParameters[field.inputParamName][i][1]
                }
                processedData.inputParameters[field.inputParamName] = nMap
            }
        }

        // end proccess dataset
        yield call(
            createApiSafely,
            createWorkflowExecution,
            workflowId,
            processedData
        )

        yield put(Actions.Creators.createSuccess(true))
        yield put(
            routerActions.navigateTo(ROUTE_WORKFLOWEXECUTIONS_LIST, {
                workflowId,
            })
        )
    } catch (err) {
        console.error("Error in saga for creating workflow execution - ", err)
        ToastsStore.warning(`WF Execution Creation: ${err}`, 10000)
        yield put(Actions.Creators.createError(err))
    }
}

function* onCancel() {
    if (window.confirm("Are you sure?")) {
        const workflowId = yield select(getWorkflowsDetailId)
        const workflowExecutionId = yield select(getWorkflowExecutionDetailId)
        yield call(
            deleteApiSafely,
            cancelWorkflowExecution,
            workflowId,
            workflowExecutionId
        )
        yield put(
            routerActions.navigateTo(ROUTE_WORKFLOWEXECUTIONS_LIST, {
                workflowId,
            })
        )
    }
}

function* onRemove() {
    if (window.confirm("Are you sure?")) {
        const workflowId = yield select(getWorkflowsDetailId)
        const workflowExecutionId = yield select(getWorkflowExecutionDetailId)
        try {
            yield put(Actions.Creators.deleteStart(true))

            yield call(
                deleteApiSafely,
                deleteWorkflowExecution,
                workflowId,
                workflowExecutionId
            )

            yield put(Actions.Creators.deleteSuccess(true))
        } catch (err) {
            console.error(
                "Error in saga for deleting workflow execution - ",
                err
            )
            yield put(Actions.Creators.deleteError(err))
        }
        yield put(
            routerActions.navigateTo(ROUTE_WORKFLOWEXECUTIONS_LIST, {
                workflowId,
            })
        )
    }
}

function* cancelFork(forkObj) {
    yield cancel(forkObj)
}

// loads dataset content, when dataset selected
function* handleSelectDataset() {
    let fetchStatus = yield select(getFetchingStateOfDatasets)
    if (fetchStatus) {
        yield delay(500)
        fetchStatus = yield select(getFetchingStateOfDatasets)
    }

    const handler = yield fork(catchOnChangeDataset)
    yield fork(
        onRouteLeaveOnce,
        ROUTE_WORKFLOWEXECUTION_CREATE,
        cancelFork,
        handler
    )
}

function* catchOnChangeDataset() {
    const mem = {}
    const formName = "workflow-execution-create"
    const initValues = yield select(getWorkflowsDetail)
    // load content of dataset in initial values
    if (
        initValues &&
        initValues.inputParameters &&
        initValues.inputParameters.find(p => p.isDataset)
    ) {
        const relevantParams = initValues.inputParameters.filter(
            p =>
                p.isDataset &&
                p.isDatasetPath &&
                p.inputParamDefaultValue !== "<nil>"
        )
        // dataset IDs, where no content is required
        const datasetIDsWithout = relevantParams
            .filter(p => p.isDatasetId)
            .map(param => param.inputParamDefaultValue)
        const datasetIDs = relevantParams
            .filter(p => !p.isDatasetId)
            .map(param => {
                const { internalID } = extractIntIDandPathFromStagePath(
                    param.inputParamDefaultValue
                )
                return internalID
            })
        yield call(waitForDatasetLoaded, datasetIDsWithout)
        const loadedStat = yield call(waitForDatasetLoaded, datasetIDs)
        if (loadedStat) {
            // all datasets detail loaded successfuly
            yield all(
                datasetIDs.map(datasetID =>
                    put(
                        dataSetsActions.Creators.requestDatasetContent(
                            datasetID
                        )
                    )
                )
            )
        }
    }
    while (true) {
        /**
         * @type {{payload:{value: any, label: string}, meta: string}} payload is type of option of component react-select
         */
        const action = yield take("@@redux-form/CHANGE")
        const { meta, payload } = action
        if (
            meta &&
            meta.form === formName &&
            meta.field.endsWith("_==datasetID")
        ) {
            const splittedKey = meta.field.split("_")
            const pureFieldName = splittedKey
                .slice(0, splittedKey.length - 1)
                .join("_")
                .split(".")
                .slice(1, splittedKey.length - 1)
                .join(".")
            const { inputParameters } = yield select(getWorkflowsDetail)
            const inputParameter = inputParameters.find(
                p => p.inputParamName === pureFieldName
            )
            if (inputParameter.isDataset && !inputParameter.isDatasetId) {
                const datasetPathName = `${pureFieldName}_==datasetFilePath`
                const forms = yield select(getForms)
                const wfFormValues =
                    forms && forms[formName] && forms[formName].values

                if (
                    mem[meta.field] &&
                    mem[meta.field].value !== payload.value &&
                    wfFormValues.inputParameters[datasetPathName]
                ) {
                    yield put(
                        clearFields(
                            formName,
                            true,
                            false,
                            `inputParameters.${datasetPathName}`
                        )
                    )
                }
                mem[meta.field] = payload.value
                const datasetsContent = yield select(getDataSetsFilelist)
                if (!datasetsContent[payload.value]) {
                    // load dataset content
                    const datasets = yield select(getDataSetsList)
                    const dataset = datasets[payload.value]
                    const datasetContent = yield call(
                        readApiSafely,
                        filelistDataSet,
                        dataset.location.internalID,
                        dataset.location.access,
                        dataset.location.project,
                        dataset.location.zone
                    )
                    yield call(
                        normalizeAndStore,
                        { ...datasetContent, internalID: payload.value },
                        datasetFilelistSchema
                    )
                    yield put(
                        dataSetsActions.Creators.filelistFetched(payload.value)
                    )
                }
            }
        }
    }
}

function* loadHeappeParams(userScriptPath, resourceID, commandTemplateName, isFirst)
{
    yield delay(1600)
    const resources = yield select(getHpcResources)
    const resource = resources[resourceID]
    try{
        const res = yield listAvailableHeappeClusters(resource.HEAppEEndpoint)
        if(res.status !== 200)
        {
            throw Error("Unable to load available clusters")
        }
        let availableClusters = res.data
        let commandTemplateID = null
        for (let i = 0; i < availableClusters.length && commandTemplateID === null; i++) {
            const cluster = availableClusters[i];
            for (let j = 0; j < cluster.NodeTypes.length && commandTemplateID === null; j++) {
                const nodeType = cluster.NodeTypes[j];
                for (let k = 0; k < nodeType.CommandTemplates.length && commandTemplateID === null; k++) {
                    const commandTemplate = nodeType.CommandTemplates[k];
                    if(commandTemplate.Name === commandTemplateName)
                        commandTemplateID = commandTemplate.ID
                }
            } 
        }
        if(commandTemplateID === null)
        {
            ToastsStore.warning("Command template name wasn't found!", 8000)
            return;
        }

        const paramsRes = yield getHeappeCommandTemplateParameters(null, resource.HEAppEEndpoint, userScriptPath, commandTemplateID)
        if(paramsRes.status !== 200)
        {
            throw Error("Unable to load Heappe Command Template Parameters")
        }
        const params = paramsRes.data
        yield put(Actions.Creators.adHpFlFetch(params))
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            if(isFirst)
            {
                yield put(arrayPush('workflow-execution-create', `inputParameters.computation_heappe_job.Tasks[0].TemplateParameterValues`, {CommandParameterIdentifier:param, ParameterValue: null}))
            }else
            {
                yield put(change('workflow-execution-create', `inputParameters.computation_heappe_job.Tasks[0].TemplateParameterValues[${i + 1}].CommandParameterIdentifier`, param))

            }
        }
    } catch (e) {
        ToastsStore.warning("Error: Heappe parameters: "+e.message, 20000)
        ToastsStore.info("Please try to check your inputs in fields above.",30000)
        ToastsStore.info("\"HPC Resource\", \"Heappe Command Template Name\" and \"TemplateParameterValue - userScriptPath\"",30000)
    }
}

function* checkFilledHeappeParams() {
    let isResourceSelected = false
    let isUserScriptPathSelected = false
    let isCommandTemplateName = false
    let commandTemplateName = null
    let resourceID = null
    let userScriptPath = null
    let forkedLoad = null
    
    let formInit = yield select(getFormInitialValues('workflow-execution-create'))
    let counter = 0
    while(formInit === undefined && counter < 5)
    {
        yield delay(800)
        formInit = yield select(getFormInitialValues('workflow-execution-create'))
    }
    if(formInit && formInit.inputParameters && formInit.inputParameters.computation_heappe_command_template_name)
    {
        isCommandTemplateName=true
        commandTemplateName = formInit.inputParameters.computation_heappe_command_template_name
    }
    let isFirst = true
    while(true)
    {
        const action = yield take("@@redux-form/CHANGE")
        const { meta, payload } = action
        if(meta.form === 'workflow-execution-create')
        {
            if(meta.field === '%%internal%%HEAPPE_RESOURCE_ID__')
            {
                isResourceSelected = payload && payload != ""
                if(isResourceSelected)
                {
                    resourceID = payload
                }

                if(isResourceSelected && isUserScriptPathSelected && isCommandTemplateName)
                {
                    if(forkedLoad)
                    {
                        yield cancel(forkedLoad)
                    }
                    forkedLoad = yield fork(loadHeappeParams, userScriptPath, resourceID, commandTemplateName, isFirst)
                    isFirst=false
                }
            }
            else if(meta.field === 'inputParameters.computation_heappe_job.Tasks[0].TemplateParameterValues[0].ParameterValue')
            {
                isUserScriptPathSelected = payload && payload != ""
                if(isUserScriptPathSelected)
                {
                    userScriptPath = payload
                }
                if(isResourceSelected && isUserScriptPathSelected && isCommandTemplateName)
                {
                    if(forkedLoad)
                    {
                        yield cancel(forkedLoad)
                    }
                    forkedLoad = yield fork(loadHeappeParams, userScriptPath, resourceID, commandTemplateName, isFirst)
                    isFirst=false
                }

            }else if(meta.field === 'inputParameters.computation_heappe_command_template_name')
            {
                isCommandTemplateName = payload && payload != ""
                if(isCommandTemplateName)
                {
                    commandTemplateName = payload
                }

                if(isResourceSelected && isUserScriptPathSelected && isCommandTemplateName)
                {
                    if(forkedLoad)
                    {
                        yield cancel(forkedLoad)
                    }
                    forkedLoad = yield fork(loadHeappeParams, userScriptPath, resourceID, commandTemplateName, isFirst)
                    isFirst=false
                }
            }
        }   

    }
}

function* onCreateExecutionPage() {
    yield put(dataSetsActions.Creators.requestMetadataQuery({}))
    yield destroy("batch-wf-exec")
    yield call(wfOnDetail)
    const perms = yield select(getUserFinePerms)
    const workflow = yield select(getWorkflowsDetail)
    if(workflow)
    {
        const {projectID} = workflow
        if(projectID && checkFineWritePerms(projectID, 'prj', perms) && checkFineWritePerms(projectID, 'dat', perms))
        {
            yield call(fetchPrjResources,projectID)
            if(GENERIC_TEMP_ID.includes(workflow.workflowTemplateID))
            {
                yield fork(checkFilledHeappeParams)
            }
            yield call(handleSelectDataset)
        }
    }
}

// returns promise and after resolve returns csv content on success, else returns false
function checkCSVAndReadBatchInputs(inputParams, csvFile) {
    const inputParamsObj = inputParams.reduce(
        (prev, current) => ({ ...prev, [current.inputParamName]: current }),
        {}
    )
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(csvFile)
        reader.onload = () => {
            // btoa() -> binary to ascii base64, inverted function atob()
            const lines = reader.result.split(ROW_SEPARATOR)
            const csvContent = lines.map(line => line.split(SEPARATOR))
            const firstLine = csvContent[0]

            for (let i = 0; i < inputParams.length; i++) {
                // check input column names
                const { inputParamName, inputParamRequired } = inputParams[i]
                if (
                    inputParamRequired &&
                    inputParamRequired === true &&
                    !firstLine.includes(inputParamName)
                ) {
                    return resolve([false, `line: 1 column: ${inputParamName}`])
                }
            }
            const lastIndex = csvContent.length - 1

            if (
                csvContent[lastIndex][0] === "" &&
                csvContent[lastIndex].length === 1
            )
                csvContent.pop()
            for (
                let lineIndex = 1;
                lineIndex < csvContent.length;
                lineIndex++
            ) {
                // check if all required fields are filled
                const line = csvContent[lineIndex]
                for (let i = 0; i < csvContent[lineIndex].length; i++) {
                    const {
                        inputParamName,
                        inputParamRequired,
                        isDataset,
                        isDatasetPath,
                    } = inputParamsObj[firstLine[i]]
                    let col = line[i]
                    if (
                        inputParamRequired &&
                        inputParamRequired === true &&
                        col === ""
                    ) {
                        return resolve([
                            false,
                            `line: ${lineIndex + 1} column: ${inputParamName}`,
                        ])
                    }

                    if (isDataset || isDatasetPath) {
                        // TODO: DDI does not accept / at the end of the path and because of multiple inputs types in wf template
                        line[i] =
                            col[col.length - 1] === "/"
                                ? col.slice(0, col.length - 1)
                                : col
                    }
                }
            }
            return resolve([true, csvContent])
        }
        reader.onerror = () => {
            throw new Error("FileReader: CSV inputs failed")
        }
    })
}

class ExecError extends Error {
    constructor(message, execID, additionalMsg) {
        super(message)
        this.execID = execID
        this.msg = additionalMsg
    }
}

function* onBatchExecution({ fData }) {
    try {
        yield put(Actions.Creators.batchStatusReset())
        yield put(Actions.Creators.batchErrorReset())
        yield put(Actions.Creators.createStart(true))

        const csvInput = fData.csvFile[0]
        const wfDetail = yield select(getWorkflowsDetail)
        const { inputParameters } = wfDetail
        const checkRes = yield checkCSVAndReadBatchInputs(
            inputParameters,
            csvInput
        )
        const res = checkRes[0]
        const csvContent = checkRes[1]
        if (res === false) {
            const e = new Error("CSV: Missing inputs")
            e.msg = csvContent
            throw e
        }

        yield put(Actions.Creators.batchStatusChange(false))

        // names of columns
        const colNames = csvContent[0]

        const executions = csvContent
            .slice(1, csvContent.length)
            .map(execution =>
                colNames.reduce(
                    (reduced, col, columnIndex) => {
                        if (execution[columnIndex] !== "")
                            Object.assign(reduced.inputParameters, {
                                [col]: execution[columnIndex],
                            })
                        return reduced
                    },
                    { isBatchJob: true, inputParameters: {} }
                )
            )

        try {
            yield call(
                createApiSafely,
                createWorkflowExecutions,
                wfDetail.workflowID,
                executions
            )
        } catch (e) {
            const errText = `Error while calling executions: ${e}`
            yield put(Actions.Creators.batchError(errText))
        }

        yield put(Actions.Creators.batchStatusChange(true))

        yield put(Actions.Creators.createSuccess(true))
    } catch (e) {
        yield put(Actions.Creators.batchStatusReset())
        let err = ""
        switch (e.message) {
        case "FileReader: CSV inputs failed":
            err = "Failed to read CSV file content"
            ToastsStore.error(err, 10000)
            yield put(Actions.Creators.batchError(err))
            break
        case "CSV: Missing inputs":
            err = ` Input on ${e.msg} is required, please check your inputs with CSV template and try again`
            ToastsStore.warning(err, 100000)
            yield put(Actions.Creators.batchError(err))
            break
        default:
            ToastsStore.error(
                "Unexpected error while executing wf batch execution",
                10000
            )
            console.error(e)
            yield put(Actions.Creators.createStart(true))
            yield put(
                Actions.Creators.batchError(
                    "Unexpected error: " + e.message
                )
            )
            break
        }
    }
}

export function* workflowExecutionsSaga() {
    yield all([
        fork(onRouteEnter, ROUTE_WORKFLOWEXECUTIONS_LIST, onList),
        fork(onRouteEnter, ROUTE_WORKFLOWEXECUTION_DETAIL, onDetail),
        fork(
            onRouteEnter,
            ROUTE_WORKFLOWEXECUTION_CREATE,
            onCreateExecutionPage
        ),
        fork(onRouteEnter, ROUTE_WORKFLOWEXECUTION_DETAIL, onLogs),
        fork(onRouteEnter, ROUTE_WORKFLOWEXECUTION_DETAIL, onStatus),
        takeLatest(Actions.Types.EXECUTE_BATCH, onBatchExecution),
        takeEvery(Actions.Types.CREATE, onCreate),
        takeEvery(Actions.Types.CANCEL, onCancel),
        takeEvery(Actions.Types.REMOVE, onRemove),
    ])
}
