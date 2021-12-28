import { createSelector } from "reselect"
import { getResourcesRequests as getResourcesRequestsState } from "../../root/root-selectors"
import { getResourcesRequests as getResourcesRequestsER } from "../../entity-repository/entity-repository-selectors"
import { getRouteParams } from "../../routing/routing-selectors"

export const getFetchingStateOfResourcesRequests = createSelector(
    getResourcesRequestsState,
    state => state.fetchInProgress
)

export const getProjectsHPCResourcesRequests = createSelector(
    getResourcesRequestsState,
    getResourcesRequestsER,
    (state, entityRepo) =>
        state.list.map(resourceRequestId => entityRepo[resourceRequestId])
)

export const getProjectsHPCResourcesRequestsFiltered = createSelector(
    getProjectsHPCResourcesRequests,
    resourceRequests =>
        resourceRequests &&
        resourceRequests.map(resourceRequest => ({
            HPCResourceRequestID: resourceRequest.HPCResourceRequestID,
            ApprovalStatus: resourceRequest.ApprovalStatus,
            CoreHoursExpected: resourceRequest.CoreHoursExpected,
            Budget: resourceRequest.Budget,
        }))
)

export const getProjectsHPCResourcesRequestId = createSelector(
    getRouteParams,
    routeParams => routeParams.resourceRequestId
)

export const getProjectsHPCResourcesRequestDetail = createSelector(
    getProjectsHPCResourcesRequestId,
    getResourcesRequestsER,
    (resourceRequestId, resourcesRequests) =>
        resourcesRequests[resourceRequestId]
)
