/**
 * This module contains the actions that may be dispatched to reducers. Only functions that are out of the ordinary have been documented.
 * @module actions
 */

import api from '../api/index.js'
import * as ACTIONS from '../constants/actionTypes.js'

/**
 * Convenience function for creating a redux action
 * @param {String} type - The action type
 * @param {any} payload - The action payload
 * @return {Object} - An action object with type and payload property
 * @function
 */
const createAction = (type, payload) => ({ type, payload })

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
// Used by DetailSummary component
export const getItem = (entityName, id) => (dispatch) => {
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

export const initCurrentUser = () => (dispatch) => {
    createAsyncActionSequence(
        currentUserActions,
        api.initCurrentUser(),
        dispatch
    )
}

export const refreshCurrentUser = () => (dispatch) => {
    createAsyncActionSequence(
        currentUserActions,
        api.refreshCurrentUser(),
        dispatch
    )
}
