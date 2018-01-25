import {
    PAGE as DEFAULT_PAGE,
    PAGE_SIZE as DEFAULT_PAGE_SIZE,
    USER_FIELDS as DEFAULT_USER_FIELDS,
} from '../constants/defaults';
import TRANSLATIONS from '../constants/translations';

const init = d2 => {
    this.d2 = d2;
    this.d2Api = d2.Api.getApi();
    addTranslations(d2.i18n.translations);
    window.d2Api = this.d2Api;
    console.warn(`d2Api added to the window object for easy testing in the console.
        Please remove this before building.`);
};

const parseFilter = (reqData, filter) => {
    console.log(filter);
    const { query, inactiveMonths, selfRegistered, invitationStatus } = filter;

    if (query) reqData.query = query;
    if (inactiveMonths) reqData.inactiveMonths = inactiveMonths;
    if (selfRegistered) reqData.selfRegistered = selfRegistered;
    if (invitationStatus) reqData.invitationStatus = invitationStatus;

    return reqData;
};

const getUsers = (page = DEFAULT_PAGE, filter) => {
    const pageSize = DEFAULT_PAGE_SIZE;
    const fields = DEFAULT_USER_FIELDS;
    let reqData = {
        pageSize,
        fields,
        page,
    };
    reqData = parseFilter(reqData, filter);
    return this.d2Api.get('users', reqData);
};

const addTranslations = apiTranslations => {
    TRANSLATIONS.reduce((apiTranslations, item) => {
        if (!apiTranslations[item.key]) {
            apiTranslations[item.key] = item.value;
        }
        return apiTranslations;
    }, apiTranslations);
};

export default {
    init,
    getUsers,
};
