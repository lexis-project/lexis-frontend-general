import config from "../../config"
import md5 from "md5"
import moment from "moment"
import { merge } from 'lodash'
import { call, put, select, delay } from "redux-saga/effects"
import dataSetsActions from "./data-sets-actions"
import { ToastsStore } from "react-toasts"
import { getFetchingStateOfDatasets } from "./data-sets-selectors"
import { getDataSetsList } from "../entity-repository/entity-repository-selectors"

/**
 * Hashes a short name in accordance with WP3 guidelines.
 * Allows the mapping of projects to paths in iRODS
 *
 * @param {string} project - the project short name
 * @returns {string} The project hash
 */

export function datasetTargetProjectHash(project) {
    // md5 is insecure, it should be reimplemented later according to DDI implementation
    return "proj" + md5(project)
}

/**
 * Constructs a path suitable for the WP3 staging api from the combination of access, project, internalid and username.
 *
 * @param {string} access - Access mode (user, project, public)
 * @param {string} project - the project short name
 * @param {string} internalID - the dataset internalID
 * @param {string} username - the iRODS username
 * @returns {string} The WP3 staging api path
 */

export function stagePath({ access, project, internalID }, username) {
    if (access === "user")
        return `user/${datasetTargetProjectHash(project)}/${username}/${internalID}`
    else if (access === "project")
        return `project/${datasetTargetProjectHash(project)}/${internalID}`
    else if (access === "public") return `public/${datasetTargetProjectHash(project)}/${internalID}`
    else return "No_Dataset_Specified"
}

/**
 * Constucts a WP3 iRODS path from a location and username.
 *
 * @param {{zone: string, project:string, access: 'public'|'project'|'user', internalID: string}} location - Dataset location (access, project, internalID)
 * @param {string} username - the iRODS username
 * @returns {string} The iRODS path
 */

export function irodsPath(location, username) {
    return `/${location.zone}/${stagePath(location, username)}`
}
/**
 * 
 * @param {[{location:{internalID: string, zone: string}, eudat: {'EUDAT/REPLICA': string|undefined, 'EUDAT/PARENT': string|undefined, PID: string}}]} datasets 
 * @returns datasets with __replicas property for replicated datasets
 */
export function preProcDatasets(datasets) {
    // const sortedDats = datasets.sort((a, b) => a.location.internalID === b.location.internalID ?
    //     !!a.eudat['EUDAT/REPLICA'] // negation, because defaultly desc sort !!! do not compare with undefined, weird behaviour in browsers
    //     : a.location.internalID > b.location.internalID
    // different begaviour in browsers ! https://forum.freecodecamp.org/t/the-sort-method-behaves-different-on-different-browsers/237221
    const dats = [...datasets]
    const sortedDats = dats.sort((a, b) => a.location.internalID === b.location.internalID ?
        (!!a.eudat['EUDAT/REPLICA'] ? 1: -1) // negation, because defaultly desc sort !!! do not compare with undefined, weird behaviour in browsers
        : (a.location.internalID > b.location.internalID? 1:-1)
    )
    const normDats = []
    let parentRepl = {}
    for (let i = 0; i < sortedDats.length; i++) {
        const dat = sortedDats[i]
        if(dat.eudat['EUDAT/REPLICA'] !== undefined && dat.eudat['EUDAT/PARENT'] === undefined) { // sorted, that parent of replicas is last
            dat['__replicas'] = {...parentRepl}
            normDats.push(dat)
            parentRepl = {};
        } else if(dat.eudat['EUDAT/PARENT'] !== undefined || dat.eudat['EUDAT/PARENT'] === 'True') {
            parentRepl = {
                ...parentRepl,
                [dat.location.zone]: dat.eudat.PID
            }
        } else {
            parentRepl = {}
            normDats.push(dat)
        }
    }
    return normDats
}

export const ReqLocStoragePrefix = {
    datDeletion: 'DSReqDatDeletion::',
    deletion: 'DSReqDeletion::',
    duplication: 'DSReqDuplication::',
    replication: 'DSReqReplication::',
    staging: 'DSReqStaging::',
    datasize: 'DSReqDatSize::',
    newPID: 'DSReqNewPID::'
}

export const sortByCreationDate = (a,b) => {
    const A = window.localStorage[a]
    const B = window.localStorage[b]
    if ((A && A.creation) && ( !B || !B.creation)){
        return true
    } else if ((!A || !A.creation) && (B && B.creation)){
        return true
    } else if ((A && A.creation) && ( !B || !B.creation)){
        return false
    } else if ((!A || !A.creation) && ( !B || !B.creation)){
        return true
    } else { // both dates are defined
        return moment(A.creation).unix() - moment(B.creation).unix()
    }
}

/**
 * @param {string} id
 * @param {string} reqType
 * @param {string} status
 * @param {{}} data
 */
export const mergeAndSaveReqStatusStorage = (id, reqType, status, data) => {
    const storageID = `${ReqLocStoragePrefix[reqType]}${id}`
    const storageVal = window.localStorage[storageID] && JSON.parse(window.localStorage[storageID])
    let nStorageVal

    if(storageVal){
        nStorageVal = {
            id,
            reqType,
            status: status ? status : storageVal.status,
            data: merge(data, storageVal.data),
            creation: storageVal.creation,
            lastCheck: status ? moment().toISOString() : storageVal.lastCheck
        }
    } else {
        nStorageVal = {
            id,
            reqType,
            status,
            data,
            lastCheck: moment().toISOString(),
            creation: moment().toISOString()
        }
    }
    window.localStorage.setItem(storageID, JSON.stringify(nStorageVal))
    return nStorageVal
}

export function listAndFilterReqIDs(reqIDs, reqID) {
    let reqIDsList = reqIDs && Object.keys(reqIDs).map(k=>reqIDs[k])
    if(reqID) { reqIDsList = reqIDsList && reqIDsList.filter(({id}) => id !== reqID)}
    const DatReqKeys = reqIDsList && reqIDsList.sort(sortByCreationDate)
    let SelectedReq = reqID && reqIDs && reqIDs[reqID]
    return {
        DatReqKeys,
        SelectedReq
    }
}

export function extractIntIDandPathFromStagePath (stagePath) {
    const path = stagePath[0] === '/' ? stagePath.slice(1, stagePath.length): stagePath
    const splittedDefVal = path.split("/")
    return {
        internalID: splittedDefVal[2],
        path: `/${splittedDefVal.slice(3, splittedDefVal.length).join("/")}`,
    }

}


export function* waitForDatasetLoaded(datasetIDs, runIndex){
    if(runIndex === 5) {
        ToastsStore.error("Unable to load dataset :(")
        return false
    }
    let fetchingDatasets = yield select(getFetchingStateOfDatasets)
    while(fetchingDatasets){
        yield delay(500)
        fetchingDatasets = yield select(getFetchingStateOfDatasets)
    }
    yield delay(200) // wait for sure for all store changes
    let datasets = yield select(getDataSetsList)
    let allReqDatasetsLoaded = true
    const loadedDatasetIDs = Object.keys(datasets)
    for (let i = 0; i < datasetIDs.length; i++) {
        const datasetID = datasetIDs[i]
        if(!loadedDatasetIDs.includes(datasetID)) {
            allReqDatasetsLoaded = false; 
            break
        }
    }
    if (!allReqDatasetsLoaded){
        yield put(dataSetsActions.Creators.requestMetadataQuery({},true))
        return yield call(waitForDatasetLoaded, datasetIDs, runIndex ? runIndex+1:1)     
    }
    return true
}
