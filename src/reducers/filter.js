import { FILTER_UPDATED, FILTER_RESET } from '../constants/actionTypes';
import { LIST_FILTER as DEFAULT_FILTER } from '../constants/defaults';

/**
 * Reducer to control the filter state that is used to GET filtered lists
 * @memberof module:reducers
 * @param {Object} state - Object containing values
 * @param {String} state.query='' - Query string to filter results by
 * @param {Number|null} state.inactiveMonths=null - Filter by number of inactive months (USER only)
 * @param {Bool} state.selfRegistered=false - Show self registered users only (USER only)
 * @param {String|null} state.invitationStatus=null - Filter by invitation status, possible values: 'all' or 'expired', (USER only)
 * @param {Array} state.organisationUnits=[]] - IDs of the organisation units to filter by (USER only)
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object} action.payload - Input for the new state
 * @param {String} action.payload.updateKey - Filter property key to update
 * @param {*} action.payload.updateValue - Value to set property to
 * @returns {Object} - A new filter state object
 * @function
 */
const filterReducer = (state = DEFAULT_FILTER, { type, payload }) => {
    switch (type) {
        case FILTER_UPDATED:
            const { updateKey, updateValue } = payload;
            return {
                ...state,
                [updateKey]: updateValue,
            };
        case FILTER_RESET:
            return { ...DEFAULT_FILTER };
        default:
            return state;
    }
};

export default filterReducer;
