import {
    LIST_REQUESTED,
    LIST_RECEIVED,
    LIST_ERRORED,
} from '../constants/actionTypes';

const initialState = {
    type: null,
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
            return state.type === payload.type
                ? {
                      type: payload.type,
                      items: payload.response,
                  }
                : state;
        case LIST_ERRORED:
            return {
                type: null,
                items: payload.message,
            };
        default:
            return state;
    }
};

export default listReducer;
