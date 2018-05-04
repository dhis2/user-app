import {
    INIT_CURRENT_USER,
    CURRENT_USER_ORG_UNITS_RECEIVED,
    CURRENT_USER_GROUP_MEMBERSHIP_REQUESTED,
    CURRENT_USER_GROUP_MEMBERSHIP_RECEIVED,
    CURRENT_USER_GROUP_MEMBERSHIP_ERRORED,
} from '../constants/actionTypes';

/**
 * Reducer to control the current user state. The basic state is initialized from the sectionLoader,
 * before the sections themselves are rendered. At that point it does not contain information about
 * organisation units or group memberships.
 * Information about group and organisation unit memberships is appended and refreshed on demand.
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
        case INIT_CURRENT_USER:
            // return payload;
            // Exclude symbols, methods and orgUnit related props
            return Object.getOwnPropertyNames(payload).reduce(
                (state, propertyName) => {
                    if (propertyName !== 'teiSearchOrganisationUnits') {
                        state[propertyName] = payload[propertyName];
                    }
                    return state;
                },
                {
                    userGroups: null,
                }
            );
        case CURRENT_USER_ORG_UNITS_RECEIVED:
            const {
                organisationUnits,
                dataViewOrganisationUnits,
                teiSearchOrganisationUnits,
            } = payload;
            return {
                ...state,
                organisationUnits,
                dataViewOrganisationUnits,
                teiSearchOrganisationUnits,
            };
        case CURRENT_USER_GROUP_MEMBERSHIP_REQUESTED:
            return { ...state, userGroups: null };
        case CURRENT_USER_GROUP_MEMBERSHIP_RECEIVED:
            return { ...state, userGroups: payload };
        case CURRENT_USER_GROUP_MEMBERSHIP_ERRORED:
            return { ...state, userGroups: payload };
        default:
            return state;
    }
};

export default currentUserReducer;
