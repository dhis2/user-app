import * as ACTIONS from '../constants/actionTypes';
import { PAGE as DEFAULT_PAGE } from '../constants/defaults';
import api from '../api';

// Helpers
const createAction = (type, payload) => ({ type, payload });

// List fetching
const createListRequestActionSequence = (dispatch, promise, type, silent) => {
    if (!silent) {
        dispatch(createAction(ACTIONS.LIST_REQUESTED, type));
    }
    promise
        .then(response =>
            dispatch(createAction(ACTIONS.LIST_RECEIVED, { type, response }))
        )
        .catch(error => dispatch(createAction(ACTIONS.LIST_ERRORED, { type, error })));
};

export const getList = (entityName, silent) => (dispatch, getState) => {
    const { filter, pager } = getState();
    const page = pager ? pager.page : DEFAULT_PAGE;
    const promise = api.getList(entityName, page, filter);
    createListRequestActionSequence(dispatch, promise, entityName, silent);
};

export const incrementPage = pager => (dispatch, getState) => {
    const { list: { type } } = getState();
    createListRequestActionSequence(dispatch, pager.getNextPage(), type);
};

export const decrementPage = pager => (dispatch, getState) => {
    const { list: { type } } = getState();
    createListRequestActionSequence(dispatch, pager.getPreviousPage(), type);
};

export const getItem = (entityName, viewType, id) => (dispatch, getState) => {
    dispatch(createAction(ACTIONS.ITEM_REQUESTED));
    api
        .getItem(entityName, viewType, id)
        .then(response => dispatch(createAction(ACTIONS.ITEM_RECEIVED, response)))
        .catch(error => dispatch(createAction(ACTIONS.ITEM_ERRORED, error)));
};

export const initNewItem = entityType => {
    const newItem = api.getD2().models[entityType].create();
    return createAction(ACTIONS.INIT_NEW_ITEM, newItem);
};

// Regular actions
export const updateFilter = (updateKey, updateValue) => {
    return createAction(ACTIONS.FILTER_UPDATED, {
        updateKey,
        updateValue,
    });
};

export const resetFilter = forUsers => {
    return createAction(ACTIONS.FILTER_RESET);
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

export const initCurrentUser = () => {
    return createAction(ACTIONS.INIT_CURRENT_USER, api.getCurrentUser());
};

export const getCurrentUserGroupMemberships = () => (dispatch, getState) => {
    const RECEIVED = ACTIONS.CURRENT_USER_GROUP_MEMBERSHIP_RECEIVED;
    const ERRORED = ACTIONS.CURRENT_USER_GROUP_MEMBERSHIP_ERRORED;

    dispatch(createAction(ACTIONS.CURRENT_USER_GROUP_MEMBERSHIP_REQUESTED));
    api
        .getCurrentUserGroupMemberships()
        .then(response => dispatch(createAction(RECEIVED, response.userGroups)))
        .catch(error => dispatch(createAction(ERRORED, error.message)));
};
