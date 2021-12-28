import { createSelector } from "reselect"

import { getInteractiveStyle as getInteractiveStyleState } from "../root/root-selectors"

export const getHiddenSidebar = createSelector(
    getInteractiveStyleState,
    state => state.sidebarHidden
)

export const getSidebarState = createSelector(
    getInteractiveStyleState,
    state => state.sidebarState
)

export const getSidebarMiniState = createSelector(
    getInteractiveStyleState,
    state => state.sidebarMiniState
)
