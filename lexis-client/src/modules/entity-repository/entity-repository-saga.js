import { normalize } from "normalizr"
import { put } from "redux-saga/effects"

import Actions from "./entity-repository-actions"
import apiActions from "../api/api-actions"
import { datasets } from "../api/schema"
import { preProcDatasets } from "../data-sets/data-sets-utils"

export function* normalizeAndStore(data, schema) {
    let inData = data
    try {
        // preproccess datasets
        if(schema === datasets) inData = preProcDatasets(inData)
        const { entities: repository, result } = normalize(inData, schema)
        yield put(Actions.Creators.repositoryHasChanged(repository))
        return result
    } catch (error) {
        console.error("normalizeAndStore -", error)
        yield put(apiActions.Creators.internalServerError("Unexpected error"))
    }
}

export function* StoreDataTemp(data) {
    yield put(Actions.Creators.repositoryHasChanged({ temp: data }))
}
