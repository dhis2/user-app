// LISTS
export const USER_LIST = [
    'displayName',
    'id',
    'access',
    'userCredentials[username,disabled]',
    'teiSearchOrganisationUnits[id,path]',
];
export const USER_GROUP_LIST = [
    'displayName',
    'id',
    'access',
    'user[displayName,id]',
    'publicAccess',
    'userGroupAccesses',
];
export const USER_ROLE_LIST = [...USER_GROUP_LIST, 'description'];

// DETAILS
export const USER_DETAILS = [
    'id',
    'access',
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
    'userCredentials[id,username,externalAuth,twoFA,userRoles[id,displayName],cogsDimensionConstraints[id,displayName,dimensionType],catDimensionConstraints[id,displayName,dimensionType],openId,ldapId]',
    'teiSearchOrganisationUnits[id,path]',
];
export const USER_GROUP_DETAILS = [
    'id',
    'access',
    'displayName',
    'name',
    'users',
    'managedGroups',
];
export const USER_ROLE_DETAILS = [
    'id',
    'access',
    'displayName',
    'name',
    'description',
    'authorities',
];

export const CURRENT_USER_ORG_UNITS_FIELDS = {
    fields: [
        'organisationUnits[id,path,displayName,children::isNotEmpty]',
        'dataViewOrganisationUnits[id,path,displayName,children::isNotEmpty]',
        'teiSearchOrganisationUnits[id,path,displayName,children::isNotEmpty]',
    ],
};

export const ORG_UNITS_QUERY_CONFIG = {
    paging: false,
    // userDataViewFallback: true
    fields: ['id', 'path', 'displayName', 'children::isNotEmpty', 'ancestors'],
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
};
export default FIELDS;
