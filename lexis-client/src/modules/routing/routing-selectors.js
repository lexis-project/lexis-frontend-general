import { createSelector } from "reselect"
import { getRouting as getState } from "../root/root-selectors"

export const getRouteName = createSelector(
    getState,
    state => state.route && state.route.name
)

export const getRouteParams = createSelector(
    getState,
    //if state.route is missing then return false
    //and if state.route is there then return state.route.params
    state => state.route && state.route.params
)

export const getRoutePath = createSelector(
    getState,
    state => state && state.previousRoute
)
