/* eslint-disable max-params */

/**
 * This module contains the actions that may be dispatched to reducers. Only functions that are out of the ordinary have been documented.
 * @module actions
 */

import api from '../api'
import * as ACTIONS from '../constants/actionTypes'
import { PAGE as DEFAULT_PAGE } from '../constants/defaults'

/**
 * Convenience function for creating a redux action
 * @param {String} type - The action type
 * @param {any} payload - The action payload
 * @return {Object} - An action object with type and payload property
 * @function
 */
const createAction = (type, payload) => ({ type, payload })

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
    if (!silent) dispatch(createAction(ACTIONS.LIST_REQUESTED, type))

    try {
        const items = await promise
        dispatch(createAction(ACTIONS.LIST_RECEIVED, { type, items }))
    } catch (error) {
        dispatch(createAction(ACTIONS.LIST_ERRORED, { type, error }))
    }
}

export const getList = (entityName, silent) => (dispatch, getState) => {
    const { filter, pager } = getState()
    const page = pager ? pager.page : DEFAULT_PAGE
    const promise = api.getList(entityName, page, filter)
    createListActionSequence(dispatch, promise, entityName, silent)
}

export const incrementPage = pager => (dispatch, getState) => {
    const {
        list: { type },
    } = getState()
    createListActionSequence(dispatch, pager.getNextPage(), type)
}

export const decrementPage = pager => (dispatch, getState) => {
    const {
        list: { type },
    } = getState()
    createListActionSequence(dispatch, pager.getPreviousPage(), type)
}

/**
 * Helper function for general fetch scenarios. Used by `getItem`, `initCurrentUser` and `refreshCurrentUser`.
 * @param {Object} actions - The action types to dispatch
 * @param {String} actions.requested - The name of the action to dispatch when initializing the request
 * @param {String} actions.received - The name of the action to dispatch on successfull response
 * @param {String} actions.errored - The name of the action to dispatch when request failed
 * @param {Object} promise - The promise to await
 * @param {Function} dispatch - Redux helper function that can dispatch an action
 * @function
 */
const createAsyncActionSequence = async (actionTypes, promise, dispatch) => {
    dispatch(createAction(actionTypes.requested))

    try {
        const payload = await promise
        dispatch(createAction(actionTypes.received, payload))
    } catch (error) {
        dispatch(createAction(actionTypes.errored, error))
    }
}
/**
 * Gets an item of a specified type and dispatches actions on request, response and error
 * @param {String} entityName - The type of item to fetch, i.e. user / userRole / userGroup
 * @param {String} id - The item ID
 * @function
 */
export const getItem = (entityName, id) => dispatch => {
    createAsyncActionSequence(
        {
            requested: ACTIONS.ITEM_REQUESTED,
            received: ACTIONS.ITEM_RECEIVED,
            errored: ACTIONS.ITEM_ERRORED,
        },
        api.getItem(entityName, id),
        dispatch
    )
}

const currentUserActions = {
    requested: ACTIONS.CURRENT_USER_REQUESTED,
    received: ACTIONS.CURRENT_USER_RECEIVED,
    errored: ACTIONS.CURRENT_USER_ERRORED,
}

export const initCurrentUser = () => dispatch => {
    createAsyncActionSequence(
        currentUserActions,
        api.initCurrentUser(),
        dispatch
    )
}

export const refreshCurrentUser = () => dispatch => {
    createAsyncActionSequence(
        currentUserActions,
        api.refreshCurrentUser(),
        dispatch
    )
}

/*****************
 * PLAIN ACTIONS *
 *****************/
export const initNewItem = entityType => {
    const newItem = api.getD2().models[entityType].create()
    return createAction(ACTIONS.INIT_NEW_ITEM, newItem)
}

export const clearItem = () => {
    return createAction(ACTIONS.CLEAR_ITEM)
}

export const updateFilter = (updateKey, updateValue) => {
    return createAction(ACTIONS.FILTER_UPDATED, {
        updateKey,
        updateValue,
    })
}

export const resetFilter = () => {
    return createAction(ACTIONS.FILTER_RESET)
}

export const resetPager = () => {
    return createAction(ACTIONS.PAGER_RESET)
}

export const showSnackbar = props => {
    return createAction(ACTIONS.SHOW_SNACKBAR, props)
}

export const hideSnackbar = () => {
    return createAction(ACTIONS.HIDE_SNACKBAR)
}

export const showDialog = (content, props) => {
    return createAction(ACTIONS.SHOW_DIALOG, { content, props })
}

export const hideDialog = () => {
    return createAction(ACTIONS.HIDE_DIALOG)
}

export const showSharingDialog = (id, type) => {
    return createAction(ACTIONS.SHOW_SHARING_DIALOG, { id, type })
}

export const hideSharingDialog = () => {
    return createAction(ACTIONS.HIDE_SHARING_DIALOG)
}
