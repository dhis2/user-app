import { LIST_RECEIVED, PAGER_RESET } from '../constants/actionTypes'

/**
 * Reducer to control the pager state. The pager state is used as a query parameter when fetching lists from the API.
 * @memberof module:reducers
 * @param {Object|null} state=null - Either an instance of a d2 Pager, or null incase the pager is being reset.
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object} action.payload - Input for the new state
 * @returns {Object|null} - A new state object
 * @function
 */
const pagerReducer = (state = null, { type, payload }) => {
    switch (type) {
        case PAGER_RESET:
            return null
        case LIST_RECEIVED:
            return payload.items.pager
        default:
            return state
    }
}

export default pagerReducer
