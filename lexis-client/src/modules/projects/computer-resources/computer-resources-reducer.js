import { createReducer } from "reduxsauce"

import Actions from "./computer-resources-actions"

const INITIAL_STATE = {
    list: [],
}

const onListFetched = (state, { ids }) => ({
    ...state,
    list: ids,
})

export const HANDLERS = { [Actions.Types.LIST_FETCHED]: onListFetched }

export default createReducer(INITIAL_STATE, HANDLERS)
