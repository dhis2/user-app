export const PAGE_SIZE = 5;

export const PAGE = 1;

export const USER_LIST_FIELDS = ['displayName', 'id', 'userCredentials[username]'];

export const USER_PROFILE_FIELDS = [
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
    'organisationUnits[id,displayName]',
    'userCredentials[username,externalAuth,userRoles[id,displayName]]',
];

export const USER_PROFILE_FIELDS_JSON = USER_PROFILE_FIELDS.reduce((allFields, field) => {
    switch (field) {
        case 'id':
        case 'displayName':
            break;
        case 'organisationUnits[displayName]':
            allFields.push('organisationUnits');
            break;
        case 'userCredentials[userRoles[displayName]]':
            allFields.push('userRoles');
            break;
        default:
            allFields.push(field);
            break;
    }
    return allFields;
}, []);

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
