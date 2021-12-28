import { createSelector } from "reselect"
import { getRouteParams } from "../../routing/routing-selectors"
import { getResources as getHPCResourcesER } from "../../entity-repository/entity-repository-selectors"

export const getResourcesProjectId = createSelector(
    getRouteParams,
    routeParams => routeParams.id
)

export const getResourceId = createSelector(
    getRouteParams,
    routeParams => routeParams.resourceId
)

export const getResourceDetail = createSelector(
    getResourceId,
    getHPCResourcesER,
    (hpcresourceId, resources) => resources[hpcresourceId]
)
