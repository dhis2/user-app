import { parseDateFromUTCString } from '../utils';
import _ from '../constants/lodash';
import {
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
        case ITEM_REQUESTED:
            return null;
        case USER_ITEM_RECEIVED:
            return parseUser(payload);
        case USER_ROLE_ITEM_RECEIVED:
            return parseRole(payload);
        case USER_GROUP_ITEM_RECEIVED:
            return parseGroup(payload);
        case ITEM_ERRORED:
            return payload;
        default:
            return state;
    }
};

const parseUser = user => {
    const { organisationUnits, userCredentials: { userRoles }, birthday, gender } = user;
    delete user.userCredentials;
    user.organisationUnits = organisationUnits.map(unit => unit.displayName).join(', ');
    user.userRoles = userRoles.map(role => role.displayName).join(', ');
    user.birthday = birthday ? parseDateFromUTCString(birthday) : '';
    user.gender = gender ? _.capitalize(gender.replace('gender_', '')) : '';
    return user;
};

const parseRole = user => user;

const parseGroup = user => user;

export default currentItemReducer;
