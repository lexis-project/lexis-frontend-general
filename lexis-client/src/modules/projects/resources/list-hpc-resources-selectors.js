import { createSelector } from "reselect"
import { getHPCresources as getHPCresourcesState } from "../../root/root-selectors"
import { getHpcResources as getHpcResourcesER } from "../../entity-repository/entity-repository-selectors"

export const getFetchingStateOfHPCResources = createSelector(
    getHPCresourcesState,
    state => state.fetchInProgress
)

export const getHPCResourcesList = createSelector(
    getHPCresourcesState,
    getHpcResourcesER,
    (state, entityRepo) => {
        return state && state.list.map(hpcResourcesId => entityRepo[hpcResourcesId])
    })
