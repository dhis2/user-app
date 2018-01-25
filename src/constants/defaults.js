export const PAGE_SIZE = 5;
export const PAGE = 1;
export const USER_FIELDS = ['displayName', 'id', 'userCredentials[username]'];
export const LIST_FILTER = {
    query: '', // string
};
export const USER_LIST_FILTER = {
    query: '', // string
    inactiveMonths: null, // Number
    selfRegistered: false, // Bool
    invitationStatus: null, // 'all' || 'expired',
};
export const PAGER = {
    page: 1,
    pageCount: null,
    total: null,
    pageSize: null,
    currentlyShown: null,
};
