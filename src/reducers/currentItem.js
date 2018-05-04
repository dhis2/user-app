import {
    CLEAR_ITEM,
    INIT_NEW_ITEM,
    ITEM_REQUESTED,
    ITEM_RECEIVED,
    ITEM_ERRORED,
} from '../constants/actionTypes';

/**
 * @module reducers
 */

/**
 * Reducer to control the current item state
 * @memberof module:reducers
 * @param {Object|String|null} state=null - Can have the following forms:
 * - A d2 model instance of type User, UserGroup, or UserRole
 * - A string in case of an error
 * - `null` while the API request is pending.
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object|String|null} action.payload - Input for the new state
 * @returns {Object|String|null} - A new state object
 * @function
 */
const currentItemReducer = (state = null, { type, payload }) => {
    switch (type) {
        case CLEAR_ITEM:
        case ITEM_REQUESTED:
            return null;
        case INIT_NEW_ITEM:
        case ITEM_RECEIVED:
            return payload;
        case ITEM_ERRORED:
            return payload;
        default:
            return state;
    }
};

export default currentItemReducer;
