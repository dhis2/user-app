import * as ACTIONS from '../constants/actionTypes';
import api from '../api';

// Helpers
const createAction = (type, payload) => ({ type, payload });

const createListRequestActionSequence = (dispatch, promise, silent) => {
    if (!silent) {
        dispatch(createAction(ACTIONS.LIST_REQUESTED));
    }
    promise
        .then(response => dispatch(createAction(ACTIONS.LIST_RECEIVED, response)))
        .catch(error => dispatch(createAction(ACTIONS.LIST_ERRORED, error.message)));
};

const getListGeneric = (listName, dispatch, getState, silent) => {
    const { filter, pager: { page } } = getState();
    const promise = api[`get${listName}`](page, filter);
    createListRequestActionSequence(dispatch, promise, silent);
};

const createItemRequestActionSequence = (dispatch, promise, receivedActionName) => {
    dispatch(createAction(ACTIONS.ITEM_REQUESTED));
    promise
        .then(response => dispatch(createAction(receivedActionName, response)))
        .catch(error => dispatch(createAction(ACTIONS.ITEM_ERRORED, error.message)));
};

// Thunks
export const getUser = id => (dispatch, getState) => {
    createItemRequestActionSequence(
        dispatch,
        api.getUser(id),
        ACTIONS.USER_ITEM_RECEIVED
    );
};

export const getUsers = silent => (dispatch, getState) => {
    getListGeneric('Users', dispatch, getState, silent);
};

export const getRoles = silent => (dispatch, getState) => {
    getListGeneric('Roles', dispatch, getState, silent);
};

export const getGroups = silent => (dispatch, getState) => {
    getListGeneric('Groups', dispatch, getState, silent);
};

export const incrementPage = pager => dispatch => {
    createListRequestActionSequence(dispatch, pager.getNextPage());
};

export const decrementPage = pager => dispatch => {
    createListRequestActionSequence(dispatch, pager.getPreviousPage());
};

// Regular actions
export const updateFilter = (currentFilter, updateKey, updateValue) => {
    return createAction(ACTIONS.FILTER_UPDATED, {
        currentFilter,
        updateKey,
        updateValue,
    });
};

export const resetFilter = forUsers => {
    const actionType = forUsers ? ACTIONS.FILTER_RESET_FOR_USER : ACTIONS.FILTER_RESET;
    return createAction(actionType);
};

export const resetPager = () => {
    return createAction(ACTIONS.PAGER_RESET);
};

export const showSnackbar = props => {
    return createAction(ACTIONS.SHOW_SNACKBAR, props);
};

export const hideSnackbar = () => {
    return createAction(ACTIONS.HIDE_SNACKBAR);
};

export const showDialog = (content, props) => {
    return createAction(ACTIONS.SHOW_DIALOG, { content, props });
};

export const hideDialog = () => {
    return createAction(ACTIONS.HIDE_DIALOG);
};
