import { LIST_REQUESTED, LIST_RECEIVED, LIST_ERRORED } from '../constants/actionTypes';

/*
 * List can have the following states:
 * - Populated array after receiving a response
 * - Empty array after receiving a response with no matches
 * - Null during request
 * - Error message string on error
 */
const listReducer = (state = null, { type, payload }) => {
    switch (type) {
        case LIST_REQUESTED:
            return null;
        case LIST_RECEIVED:
            return parseListType(payload);
        case LIST_ERRORED:
            return payload;
        default:
            return state;
    }
};

const parseListType = modelCollection => {
    const type = modelCollection.modelDefinition.name;
    return modelCollection.toArray().map(mappings[type]);
};

const mappings = {
    user: item => {
        item.userName = item.userCredentials.username;
        return item;
    },
    userRole: item => item,
    userGroup: item => {
        return item;
    },
};

export default listReducer;
