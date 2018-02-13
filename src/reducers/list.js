import { LIST_REQUESTED, LIST_RECEIVED, LIST_ERRORED } from '../constants/actionTypes';
import { USER } from '../constants/entityTypes';

const initialState = {
    type: USER,
    items: null,
};

/*
 * List can have the following states:
 * - ModelCollection
 * - Null during request
 * - Error message string on error
 */
const listReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case LIST_REQUESTED:
            return {
                type: payload,
                items: null,
            };
        case LIST_RECEIVED:
            return {
                type: payload.type,
                items: payload.response,
            };
        case LIST_ERRORED:
            return {
                type: payload.type,
                items: payload.message,
            };
        default:
            return state;
    }
};

export default listReducer;
