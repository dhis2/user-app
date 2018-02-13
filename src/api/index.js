import {
    PAGE as DEFAULT_PAGE,
    PAGE_SIZE as DEFAULT_PAGE_SIZE,
    USER_LIST_FIELD_FILTER,
    USER_ROLES_LIST_FIELD_FILTER,
    USER_GROUPS_LIST_FIELD_FILTER,
    USER_PROFILE_FIELD_FILTER,
} from '../constants/defaults';

import { USER, USER_GROUP, USER_ROLE } from '../constants/entityTypes';

const init = d2 => {
    this.d2 = d2;
    this.d2Api = d2.Api.getApi();
    this.pager = null;

    // TODO: Remove this
    window.d2 = this.d2;
    window.d2Api = this.d2Api;
    console.warn(`d2 and d2Api added to the window object for easy testing in the console.
        Please remove this before building.`);
};

const getFieldsForListType = entityName => {
    switch (entityName) {
        case USER:
            return USER_LIST_FIELD_FILTER;
        case USER_GROUP:
            return USER_GROUPS_LIST_FIELD_FILTER;
        case USER_ROLE:
            return USER_ROLES_LIST_FIELD_FILTER;
        default:
            return USER_LIST_FIELD_FILTER;
    }
};

const parseRequestData = (page = DEFAULT_PAGE, filter, fields) => {
    const { query, inactiveMonths, selfRegistered, invitationStatus } = filter;

    let requestData = {
        pageSize: DEFAULT_PAGE_SIZE,
        fields,
        page,
    };

    if (query) requestData.query = query;
    if (inactiveMonths) requestData.inactiveMonths = inactiveMonths;
    if (selfRegistered) requestData.selfRegistered = selfRegistered;
    if (invitationStatus) requestData.invitationStatus = invitationStatus;

    return requestData;
};

const getList = (entityName, page, filter) => {
    const fields = getFieldsForListType(entityName);
    const requestData = parseRequestData(page, filter, fields);
    return this.d2.models[entityName].list(requestData);
};

const getUser = id => {
    if (typeof id !== 'string') {
        throw new Error(
            `api.getUser was called without passing a valid id. Value of id is: ${id}`
        );
    }
    return this.d2.models.user.get(id, { fields: USER_PROFILE_FIELD_FILTER });
};

const getUserByUsername = username => {
    return this.d2.models.users
        .filter()
        .on('userCredentials.username')
        .equals(username)
        .list({ fields: ['id'] });
};

const replicateUser = (id, username, password) => {
    const url = `/users/${id}/replica`;
    const data = { username, password };
    return this.d2Api.post(url, data);
};

const getD2 = () => this.d2;

export default {
    init,
    getD2,
    getList,
    getUser,
    getUserByUsername,
    replicateUser,
};
