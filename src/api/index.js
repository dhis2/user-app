import _ from '../constants/lodash';
import {
    PAGE as DEFAULT_PAGE,
    PAGE_SIZE as DEFAULT_PAGE_SIZE,
} from '../constants/defaults';

import FIELDS, {
    ORG_UNITS_QUERY_CONFIG,
    USER_GROUP_QUERY_CONFIG,
} from '../constants/queryFields';

const init = d2 => {
    this.d2 = d2;
    this.d2Api = d2.Api.getApi();

    // TODO: Remove this
    window.d2 = this.d2;
    window.d2Api = this.d2Api;
    console.warn(`d2 and d2Api added to the window object for easy testing in the console.
        Please remove this before building.`);
};

const getQueryFields = (entityName, viewType) => {
    const formattedEntityName = _.snakeCase(entityName).toUpperCase();
    const varName = viewType
        ? `${formattedEntityName}_${viewType}`
        : `${formattedEntityName}_LIST`;

    return FIELDS[varName];
};

const createRequestData = (page = DEFAULT_PAGE, filter, fields) => {
    const {
        query,
        inactiveMonths,
        selfRegistered,
        invitationStatus,
        organisationUnits,
    } = filter;

    let requestData = {
        pageSize: DEFAULT_PAGE_SIZE,
        fields,
        page,
    };

    if (query) requestData.query = query;
    if (inactiveMonths) requestData.inactiveMonths = inactiveMonths;
    if (selfRegistered) requestData.selfRegistered = selfRegistered;
    if (invitationStatus) requestData.invitationStatus = invitationStatus;

    if (organisationUnits.length) {
        const ids = organisationUnits.map(unit => unit.id).join();
        requestData.filter = `organisationUnits.id:in:[${ids}]`;
    }

    return requestData;
};

const getList = (entityName, page, filter) => {
    const fields = getQueryFields(entityName);
    const requestData = createRequestData(page, filter, fields);
    return this.d2.models[entityName].list(requestData);
};

const getItem = (entityName, viewType, id) => {
    const fields = getQueryFields(entityName, viewType);
    return this.d2.models[entityName].get(id, fields);
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

const getOrgUnits = () => {
    const listConfig = {
        ...ORG_UNITS_QUERY_CONFIG,
        level: 1,
    };
    return this.d2.models.organisationUnits
        .list(listConfig)
        .then(rootLevel => rootLevel.toArray()[0]);
};

const queryOrgUnits = query => {
    const listConfig = {
        ...ORG_UNITS_QUERY_CONFIG,
        query,
    };
    return this.d2.models.organisationUnits.list(listConfig);
};

const queryUserGroups = query => {
    const listConfig = {
        ...USER_GROUP_QUERY_CONFIG,
        query,
    };
    return this.d2.models.userGroups.list(listConfig);
};

const updateUserTeiSearchOrganisations = (userId, data) => {
    const url = `/users/${userId}/teiSearchOrganisationUnits`;
    return this.d2Api.post(url, data);
};

const updateSharingSettings = (entityType, id, data) => {
    const url = `/sharing?type=${entityType}&id=${id}`;
    return this.d2Api.post(url, data);
};

const getCurrentUserGroupMemberships = () => {
    return this.d2Api.get('/me', { fields: ['userGroups[:all]'] });
};

const updateCurrentUserGroupMembership = (groupId, deleteMembership) => {
    const method = deleteMembership ? 'delete' : 'post';
    const url = `/users/${this.d2.currentUser.id}/userGroups/${groupId}`;
    return this.d2Api[method](url);
};

const updateDisabledState = (id, disabled) => {
    const url = `/users/${id}`;
    const data = { userCredentials: { disabled: disabled } };
    return this.d2Api.patch(url, data);
};

const getManagedUsers = () => {
    const data = { /*canManage: true,*/ fields: ['id', 'displayName'] };
    return this.d2.models.user.list(data);
};

const getAvailableUsergroups = () => {
    const data = { /*canManage: true,*/ fields: ['id', 'displayName'] };
    return this.d2.models.userGroups.list(data);
};

const getAvailableUserRoles = () => {
    const data = { /*canManage: true,*/ fields: ['id', 'displayName'] };
    return this.d2.models.userRoles.list(data);
};

const getAvailableDataAnalyticsDimensionRestrictions = () => {
    const url = '/dimensions/constraints';
    const data = { fields: ['id', 'name'] };
    return this.d2Api.get(url, data).then(({ dimensions }) => dimensions);
};

const updateUserGroup = (id, data) => {
    const url = `/userGroups/${id}`;
    return this.d2Api.patch(url, data);
};

const getAvailableLocales = () => {
    const dbLocales = this.d2Api.get('/locales/db');
    const uiLocales = this.d2Api.get('/locales/ui');
    return Promise.all([dbLocales, uiLocales]).then(responses => ({
        db: responses[0],
        ui: responses[1],
    }));
};

const getD2 = () => this.d2;

const getCurrentUser = () => this.d2.currentUser;

export default {
    init,
    getD2,
    getCurrentUser,
    getList,
    getItem,
    getUserByUsername,
    replicateUser,
    getOrgUnits,
    queryOrgUnits,
    queryUserGroups,
    getCurrentUserGroupMemberships,
    updateCurrentUserGroupMembership,
    updateDisabledState,
    updateUserTeiSearchOrganisations,
    updateSharingSettings,
    getManagedUsers,
    getAvailableUsergroups,
    getAvailableUserRoles,
    getAvailableDataAnalyticsDimensionRestrictions,
    getAvailableLocales,
    updateUserGroup,
};
