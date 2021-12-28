import { createReducer } from "reduxsauce"

import Actions from "./projects-actions"

const INITIAL_STATE = {
    list: [],
    users: [],
    addUserForm: false,
    fetchInProgress: false,
    error: null
};

const onListFetchStart = (state) => ({
    ...state,
    fetchInProgress: true,
    error: null
})

const onListFetch = (state, { ids }) => ({
    ...state,
    list: ids,
    fetchInProgress: true,
    error: null
});

const onUsersFetch = (state, { ids }) => ({
    ...state,
    users: ids,
    fetchInProgress: true,
    error: null
});

const onListFetchSuccess = (state) => ({
    ...state,
    fetchInProgress: false,
    error: null
})

const onListFetchError = (state, { err }) => ({
    ...state,
    fetchInProgress: false,
    error: err,
})

const onChangeAddUserForm = (state) => ({
    ...state,
    addUserForm: !state.addUserForm
})

export const HANDLERS = {
    [Actions.Types.LIST_FETCH_START]: onListFetchStart,
    [Actions.Types.LIST_FETCH]: onListFetch,
    [Actions.Types.USERS_FETCH]: onUsersFetch,
    [Actions.Types.SHOW_USER_ADD_FORM]: onChangeAddUserForm,
    [Actions.Types.LIST_FETCH_SUCCESS]: onListFetchSuccess,
    [Actions.Types.LIST_FETCH_ERROR]: onListFetchError
};

export default createReducer(INITIAL_STATE, HANDLERS)
