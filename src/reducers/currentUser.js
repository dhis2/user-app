import {
    INIT_CURRENT_USER,
    CURRENT_USER_ORG_UNITS_RECEIVED,
    CURRENT_USER_GROUP_MEMBERSHIP_REQUESTED,
    CURRENT_USER_GROUP_MEMBERSHIP_RECEIVED,
    CURRENT_USER_GROUP_MEMBERSHIP_ERRORED,
} from '../constants/actionTypes';

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
