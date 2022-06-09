import {
    CURRENT_USER_REQUESTED,
    CURRENT_USER_RECEIVED,
    CURRENT_USER_ERRORED,
} from '../constants/actionTypes.js'

/**
 * Reducer to control the current user state, initialized from the sectionLoader,
 * Can also be reloaded if certain changes take place that influence the current user.
 * @memberof module:reducers
 * @param {Object|null} state=null - An object containing relevant properties of the current user.
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object|String|null} action.payload - Input for the new state
 * @returns {Object} - A new state object
 * @function
 */
const currentUserReducer = (state = null, { type, payload }) => {
    switch (type) {
        case CURRENT_USER_REQUESTED:
            return null
        case CURRENT_USER_RECEIVED:
        case CURRENT_USER_ERRORED:
            return payload
        default:
            return state
    }
}

export default currentUserReducer
