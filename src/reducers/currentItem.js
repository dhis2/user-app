import {
    ITEM_SELECTED,
    ITEM_REQUESTED,
    USER_ITEM_RECEIVED,
    USER_ROLE_ITEM_RECEIVED,
    USER_GROUP_ITEM_RECEIVED,
    ITEM_ERRORED,
} from '../constants/actionTypes';

/*
 * List can have the following states:
 * - Object after receiving a response
 * - Null during request
 * - Error message string on error
 */
const currentItemReducer = (state = null, { type, payload }) => {
    switch (type) {
        case ITEM_SELECTED:
            return payload;
        case ITEM_REQUESTED:
            return null;
        case USER_ITEM_RECEIVED:
        case USER_ROLE_ITEM_RECEIVED:
        case USER_GROUP_ITEM_RECEIVED:
            return payload;
        case ITEM_ERRORED:
            return payload;
        default:
            return state;
    }
};

export default currentItemReducer;
