import { createReducer } from "reduxsauce"

import Actions from "./accounting-resources-requests-actions"

const INITIAL_STATE = {
    ProjectID: "",
}

const onFetched = (state, { lexisProjectID }) => ({
    ...state,
    ProjectID: lexisProjectID,
})

export const HANDLERS = { [Actions.Types.FETCHED]: onFetched }

export default createReducer(INITIAL_STATE, HANDLERS)
