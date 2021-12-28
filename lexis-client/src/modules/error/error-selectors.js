import { createSelector } from "reselect"
import { getRouteParams } from "../routing/routing-selectors"

export const getErrorType = createSelector(
    getRouteParams,
    params => params && params.eType
)

export const getErrorMessage = createSelector(
    getRouteParams,
    params => params && params.eMessage
)
