/* eslint-disable no-case-declarations */
import { call, fork, put, all, takeLatest, select } from "redux-saga/effects"
import { readApiSafely } from "../../api/api-saga"
import {
    queryDatasize,
    queryPID,
    queryStageDataset,
    queryStageDeleteDataset,
    queryDatasetDuplicationStatus,
    queryDatasetReplicationStatus
} from "../../api/client"
import { onRouteEnter } from "../../routing/on-route-enter"
import {
    ROUTE_DATA_SETS_QUEUE,
    ROUTE_DATA_SETS_QUEUE_REQ_ID
} from "../../routing/routes"
import dataSetsActions from "../data-sets-actions"
import {
    getRequestIDs,
    getRequestIDURL,
    getRequestTypeURL
} from "../data-sets-selectors"
import {
    ReqLocStoragePrefix,
    sortByCreationDate,
    mergeAndSaveReqStatusStorage
} from "../data-sets-utils"
import config from "../../../config"
import { ToastsStore } from "react-toasts"

function getLocalAndJsonParse(a) {
    return JSON.parse(window.localStorage[a])
}

function addTypeReq(t) {
    return a => ({ ...getLocalAndJsonParse(a), reqType: t })
}

function* checkReqStatus({ id, reqType }) {
    let status
    let data = {}
    const encodedID = encodeURIComponent(id)
    switch (reqType) {
    case "datDeletion":
        const { status: datDeleteRes } = yield call(
            readApiSafely,
            queryStageDeleteDataset,
            encodedID
        )
        status = datDeleteRes
        break
    case "deletion":
        const { status: delRes } = yield call(
            readApiSafely,
            queryStageDeleteDataset,
            encodedID
        )
        status = delRes
        break
    case "duplication":
        const { status: duplRes } = yield call(
            readApiSafely,
            queryDatasetDuplicationStatus,
            encodedID
        )
        status = duplRes
        break
    case "replication":
        const { status: replRes } = yield call(
            readApiSafely,
            queryDatasetReplicationStatus,
            encodedID
        )
        status = replRes
        break
    case "staging":
        const { status: stagRes } = yield call(
            readApiSafely,
            queryStageDataset,
            encodedID
        )
        status = stagRes
        break
    case "datasize":
        const {
            result: dsSizeRes,
            size,
            totalfiles,
            smallfiles
        } = yield call(readApiSafely, queryDatasize, encodedID)
        status = dsSizeRes
        data = {
            size,
            totalfiles,
            smallfiles
        }
        break
    case "newPID":
        const { status: nPIDRes, PID, target_path } = yield call(
            readApiSafely,
            queryPID,
            encodedID
        )
        status = nPIDRes
        data = {
            PID,
            target_path
        }
        break
    default:
        break
    }
    const nValue = mergeAndSaveReqStatusStorage(id, reqType, status, data)
    yield put(
        dataSetsActions.Creators.requestIdFetched(
            nValue.id,
            nValue.reqType,
            nValue.status,
            nValue.creation,
            nValue.lastCheck,
            nValue.data
        )
    )
}

function* checkPendingStatusesByType({ reqType }) {
    ToastsStore.info("Checking requests statuses...")
    const allRequests = yield select(getRequestIDs)
    const requests = allRequests[reqType]
    if (requests) {
        const pendingRequestsIDs = Object.keys(requests).filter(k =>
            requests[k].status.startsWith("Task still in the queue")
        )

        // request update for pending requests
        yield all(
            pendingRequestsIDs.map(k =>
                call(checkReqStatus, { id: k, reqType: reqType })
            )
        )
    }
    ToastsStore.success("Statuses are refreshed")
}

function* onQueueRequestsList() {
    const datDeleteReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.datDeletion))
        .sort(sortByCreationDate)
        .map(addTypeReq("datDeletion"))

    const deleteReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.deletion))
        .sort(sortByCreationDate)
        .map(addTypeReq("deletion"))

    const replicationReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.replication))
        .sort(sortByCreationDate)
        .map(addTypeReq("replication"))

    const duplicationReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.duplication))
        .sort(sortByCreationDate)
        .map(addTypeReq("duplication"))

    const stagingReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.staging))
        .sort(sortByCreationDate)
        .map(addTypeReq("staging"))

    const datSizeReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.datasize))
        .sort(sortByCreationDate)
        .map(addTypeReq("datasize"))

    const pidReq = Object.keys(window.localStorage)
        .filter(key => key.startsWith(ReqLocStoragePrefix.newPID))
        .sort(sortByCreationDate)
        .map(addTypeReq("newPID"))

    const fetchedReq = datDeleteReq.concat(
        deleteReq,
        replicationReq,
        duplicationReq,
        stagingReq,
        datSizeReq,
        pidReq
    )
    yield put(dataSetsActions.Creators.requestIdsFetched(fetchedReq))
    const urlID = yield select(getRequestIDURL)
    const urlType = yield select(getRequestTypeURL)
    if (urlID) {
        yield call(checkReqStatus, { id: urlID, reqType: urlType })
    }
}

export function openNewTabWithReqStatus(reqID, reqType) {
    window.open(
        `${config.url.base}/datasets/queue/${reqType}/${reqID}`,
        "_blank"
    )
}

export function* dataSetsSagaQueue() {
    yield all([
        fork(onRouteEnter, ROUTE_DATA_SETS_QUEUE, onQueueRequestsList),
        fork(onRouteEnter, ROUTE_DATA_SETS_QUEUE_REQ_ID, onQueueRequestsList),
        takeLatest(dataSetsActions.Types.CHECK_REQUEST_STATUS, checkReqStatus),
        takeLatest(
            dataSetsActions.Types.CHECK_PENDING_REQ_STATUSES,
            checkPendingStatusesByType
        )
    ])
}
