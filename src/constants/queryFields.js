// LISTS
export const USER_LIST = [
    'displayName',
    'id',
    'userCredentials[username,disabled]',
    'teiSearchOrganisationUnits[id,path]',
];
export const USER_GROUP_LIST = [
    'displayName',
    'id',
    'user[displayName,id]',
    'publicAccess',
    'userGroupAccesses',
];
export const USER_ROLE_LIST = [...USER_GROUP_LIST, 'description'];
// DETAILS
export const USER_DETAILS = [
    'id',
    'displayName',
    'surname',
    'firstName',
    'introduction',
    'jobTitle',
    'employer',
    'education',
    'interests',
    'nationality',
    'birthday',
    'gender',
    'languages',
    'email',
    'phoneNumber',
    'userGroups',
    'organisationUnits[id,displayName,path]',
    'dataViewOrganisationUnits[id,displayName,path]',
    'userCredentials[username,externalAuth,userRoles[id,displayName],cogsDimensionConstraints,catDimensionConstraints,openId,ldapId]',
    'teiSearchOrganisationUnits[id,path]',
];
export const USER_GROUP_DETAILS = ['id', 'displayName', 'users'];
export const USER_ROLE_DETAILS = [...USER_GROUP_DETAILS];
// EDIT
export const USER_EDIT = [...USER_DETAILS];
export const USER_GROUP_EDIT = ['id', 'displayName', 'users'];
export const USER_ROLE_EDIT = [...USER_GROUP_EDIT];

export const ORG_UNITS_QUERY_CONFIG = {
    paging: false,
    fields: ['id', 'path', 'displayName', 'children::isNotEmpty'],
};

export const USER_GROUP_QUERY_CONFIG = {
    paging: false,
    fields: ['id', 'displayName'],
};

const FIELDS = {
    USER_LIST,
    USER_GROUP_LIST,
    USER_ROLE_LIST,
    USER_DETAILS,
    USER_GROUP_DETAILS,
    USER_ROLE_DETAILS,
    USER_EDIT,
    USER_GROUP_EDIT,
    USER_ROLE_EDIT,
};
export default FIELDS;
