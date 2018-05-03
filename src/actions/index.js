/**
 * This module contains the actions that may be dispatched to reducers. Only functions that are out of the ordinary have been documented.
 * @module actions
 */

import * as ACTIONS from '../constants/actionTypes';
import { PAGE as DEFAULT_PAGE } from '../constants/defaults';
import api from '../api';
import i18n from '@dhis2/d2-i18n';

/**
 * Convenience function for creating a REDUX action
 * @param {String} type - The action type
 * @param {any} payload - The action payload
 * @return {Object} - An action object with type and payload property
 * @function
 */
const createAction = (type, payload) => ({ type, payload });

/**********
 * THUNKS *
 **********/

/**
 * Helper function for fetching lists. Used by getList, incrementPage and decrementPage.
 * @param {Function} dispatch - Redux helper function that can dispatch an action
 * @param {Object} promise - The promise to await
 * @param {String} type - The type of list that was requested
 * @param {Boolean} silent - Flag by which dispatching the LIST_REQUESTED action can be skipped
 * @function
 */
const createListActionSequence = async (dispatch, promise, type, silent) => {
    if (!silent) dispatch(createAction(ACTIONS.LIST_REQUESTED, type));

    try {
        const items = await promise;
        dispatch(createAction(ACTIONS.LIST_RECEIVED, { type, items }));
    } catch (error) {
        dispatch(createAction(ACTIONS.LIST_ERRORED, { type, error }));
    }
};

export const getList = (entityName, silent) => (dispatch, getState) => {
    const { filter, pager } = getState();
    const page = pager ? pager.page : DEFAULT_PAGE;
    const promise = api.getList(entityName, page, filter);
    createListActionSequence(dispatch, promise, entityName, silent);
};

export const incrementPage = pager => (dispatch, getState) => {
    const { list: { type } } = getState();
    createListActionSequence(dispatch, pager.getNextPage(), type);
};

export const decrementPage = pager => (dispatch, getState) => {
    const { list: { type } } = getState();
    createListActionSequence(dispatch, pager.getPreviousPage(), type);
};

/**
 * Gets an item of a specified type and dispatches actions on request, response and error
 * @param {String} entityName - The type of item to fetch, i.e. user / userRole / userGroup
 * @param {String} id - The item ID
 * @function
 */
export const getItem = (entityName, id) => async (dispatch, getState) => {
    dispatch(createAction(ACTIONS.ITEM_REQUESTED));

    try {
        const item = await api.getItem(entityName, id);
        dispatch(createAction(ACTIONS.ITEM_RECEIVED, item));
    } catch (error) {
        dispatch(createAction(ACTIONS.ITEM_ERRORED, error));
    }
};

export const appendCurrentUserOrgUnits = () => async (dispatch, getState) => {
    const RECEIVED = ACTIONS.CURRENT_USER_ORG_UNITS_RECEIVED;

    try {
        const orgUnits = await api.getCurrentUserOrgUnits();
        dispatch(createAction(RECEIVED, orgUnits));
    } catch (error) {
        const errorMsg = i18n.t(
            'Something went wrong whilst fetching the organisation units. Please refresh the page.'
        );
        dispatch(showSnackbar({ message: errorMsg }));
    }
};

export const getCurrentUserGroupMemberships = () => async (dispatch, getState) => {
    const RECEIVED = ACTIONS.CURRENT_USER_GROUP_MEMBERSHIP_RECEIVED;
    const ERRORED = ACTIONS.CURRENT_USER_GROUP_MEMBERSHIP_ERRORED;

    dispatch(createAction(ACTIONS.CURRENT_USER_GROUP_MEMBERSHIP_REQUESTED));

    try {
        const response = await api.getCurrentUserGroupMemberships();
        dispatch(createAction(RECEIVED, response.userGroups));
    } catch (error) {
        dispatch(createAction(ERRORED, error.message));
    }
};

/*****************
 * PLAIN ACTIONS *
 *****************/
export const initNewItem = entityType => {
    const newItem = api.getD2().models[entityType].create();
    return createAction(ACTIONS.INIT_NEW_ITEM, newItem);
};

export const clearItem = () => {
    return createAction(ACTIONS.CLEAR_ITEM);
};

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

export const showSharingDialog = (id, type) => {
    return createAction(ACTIONS.SHOW_SHARING_DIALOG, { id, type });
};

export const hideSharingDialog = () => {
    return createAction(ACTIONS.HIDE_SHARING_DIALOG);
};

export const initCurrentUser = () => {
    return createAction(ACTIONS.INIT_CURRENT_USER, api.getCurrentUser());
};
