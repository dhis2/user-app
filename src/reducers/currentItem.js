import {
    CLEAR_ITEM,
    INIT_NEW_ITEM,
    ITEM_REQUESTED,
    ITEM_RECEIVED,
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
