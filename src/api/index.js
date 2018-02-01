import {
    PAGE as DEFAULT_PAGE,
    PAGE_SIZE as DEFAULT_PAGE_SIZE,
    USER_LIST_FIELDS as DEFAULT_USER_LIST_FIELDS,
    USER_PROFILE_FIELDS as DEFAULT_USER_PROFILE_FIELDS,
} from '../constants/defaults';

const init = d2 => {
    this.d2 = d2;
    this.d2Api = d2.Api.getApi();
    // addTranslations();

    // TODO: Remove this
    window.d2 = this.d2;
    window.d2Api = this.d2Api;
    console.warn(`d2 and d2Api added to the window object for easy testing in the console.
        Please remove this before building.`);
};

const parseFilter = (reqData, filter) => {
    const { query, inactiveMonths, selfRegistered, invitationStatus } = filter;

    if (query) reqData.query = query;
    if (inactiveMonths) reqData.inactiveMonths = inactiveMonths;
    if (selfRegistered) reqData.selfRegistered = selfRegistered;
    if (invitationStatus) reqData.invitationStatus = invitationStatus;

    return reqData;
};

const getUsers = (page = DEFAULT_PAGE, filter) => {
    const pageSize = DEFAULT_PAGE_SIZE;
    const fields = DEFAULT_USER_LIST_FIELDS;
    let reqData = {
        pageSize,
        fields,
        page,
    };
    reqData = parseFilter(reqData, filter);
    return this.d2Api.get('users', reqData);
};

const getUser = id => {
    if (typeof id !== 'string') {
        throw new Error(
            `api.getUser was called without passing a valid id. Value of id is: ${id}`
        );
    }
    return this.d2Api.get(`users/${id}`, { fields: DEFAULT_USER_PROFILE_FIELDS });
};

const getD2 = () => this.d2;

export default {
    init,
    getD2,
    getUsers,
    getUser,
};
