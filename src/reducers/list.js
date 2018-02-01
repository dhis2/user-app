import {
    LIST_REQUESTED,
    USER_LIST_RECEIVED,
    USER_ROLE_LIST_RECEIVED,
    USER_GROUP_LIST_RECEIVED,
    LIST_ERRORED,
} from '../constants/actionTypes';

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
        case USER_LIST_RECEIVED:
            return payload.users.map(parseUser);
        case USER_ROLE_LIST_RECEIVED:
            return payload.users.map(parseUserRole);
        case USER_GROUP_LIST_RECEIVED:
            return payload.users.map(parseUserGroup);
        case LIST_ERRORED:
            return payload;
        default:
            return state;
    }
};

const parseUser = user => ({
    id: user.id,
    displayName: user.displayName,
    userName: user.userCredentials.username,
});

const parseUserRole = role => ({
    displayName: role.displayName,
});

const parseUserGroup = group => ({
    displayName: group.displayName,
});

export default listReducer;
