import {
    INIT_CURRENT_USER,
    CURRENT_USER_GROUP_MEMBERSHIP_REQUESTED,
    CURRENT_USER_GROUP_MEMBERSHIP_RECEIVED,
    CURRENT_USER_GROUP_MEMBERSHIP_ERRORED,
} from '../constants/actionTypes';

const currentUserReducer = (state = null, { type, payload }) => {
    switch (type) {
        case INIT_CURRENT_USER:
            // Exclude symbols and methods
            return Object.getOwnPropertyNames(payload).reduce(
                (state, propertyName) => {
                    state[propertyName] = payload[propertyName];
                    return state;
                },
                {
                    userGroups: null,
                }
            );
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
