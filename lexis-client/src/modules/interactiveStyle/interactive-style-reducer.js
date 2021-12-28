import { createReducer } from "reduxsauce"

import Actions from "./interactive-style-actions"

const INITIAL_STATE = {
    sidebarState: "fixed",
    sidebarMiniState: "",
    sidebarHidden: true,
    dsSize: "",
}

const onSidebarMiniExpand = (state, { sidebarMiniState }) => ({
    ...state,
    sidebarMiniState: sidebarMiniState,
})

const onSidebarToggle = (state, { sidebarState }) => ({
    ...state,
    sidebarState: sidebarState,
})

const onSidebarShow = state => ({
    ...state,
    sidebarHidden: false,
})

export const HANDLERS = {
    [Actions.Types.SIDEBAR_MINI_EXPAND]: onSidebarMiniExpand,
    [Actions.Types.SIDEBAR_TOGGLE]: onSidebarToggle,
    [Actions.Types.SIDEBAR_SHOW]: onSidebarShow
}

export default createReducer(INITIAL_STATE, HANDLERS)
