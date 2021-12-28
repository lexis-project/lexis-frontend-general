import { createSelector } from "reselect"
import { getApprovedResourcesRequests as getApprovedResourcesRequestsState } from "../../root/root-selectors"
import { getApprovedResourceRequests as getApprovedResourcesRequestsER } from "../../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../../routing/routing-selectors"

export const getFetchingStateOfApprovedResourcesRequests = createSelector(
    getApprovedResourcesRequestsState,
    state => state.fetchInProgress
)

export const getProjectsHPCApprovedResourcesRequests = createSelector(
    getApprovedResourcesRequestsState,
    getApprovedResourcesRequestsER,
    (state, entityRepo) =>
        state.list.map(resourceRequestId => entityRepo[resourceRequestId])
)

export const getProjectsHPCApprovedResourcesRequestId = createSelector(
    getRouteParams,
    routeParams => routeParams.resourceRequestId
)

export const getProjectsHPCApprovedResourcesRequestDetail = createSelector(
    getProjectsHPCApprovedResourcesRequestId,
    getApprovedResourcesRequestsER,
    (resourceRequestId, resourcesRequests) =>
        resourcesRequests[resourceRequestId]
)
