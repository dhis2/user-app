import {
    LIST_REQUESTED,
    LIST_RECEIVED,
    LIST_ERRORED,
} from '../constants/actionTypes'

const initialState = {
    type: null,
    items: null,
}

/**
 * Reducer to control the list state
 * @memberof module:reducers
 * @param {Object} state - The list state
 * @param {String|null} state.type=null - The list type, either one of 'user', 'userGroup', 'userRole', or `null` after error.
 * @param {Object|String|null} state.items=null - Can have the following forms:
 * - A d2 ModelCollection instance of type User, UserGroup, or UserRole
 * - A string in case of an error
 * - `null` while the API request is pending
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object|String|null} action.payload - Input for the new state
 * @returns {Object|String|null} - A new state object
 * @function
 */
const listReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case LIST_REQUESTED:
            return {
                type: payload,
                items: null,
            }
        case LIST_RECEIVED:
            return state.type === payload.type
                ? {
                      type: payload.type,
                      items: payload.items,
                  }
                : state
        case LIST_ERRORED:
            return {
                type: null,
                items: payload.message,
            }
        default:
            return state
    }
}

export default listReducer
