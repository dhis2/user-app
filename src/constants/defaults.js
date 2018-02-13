export const PAGE_SIZE = 5;

export const PAGE = 1;

export const USER_LIST_FIELD_FILTER = ['displayName', 'id', 'userCredentials[username]'];
export const USER_ROLES_LIST_FIELD_FILTER = ['displayName', 'id', 'description'];
export const USER_GROUPS_LIST_FIELD_FILTER = ['displayName', 'id'];
export const USER_PROFILE_FIELD_FILTER = [
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

export const USER_PROFILE_DISPLAY_FIELD_CONFIG = [
    {
        key: 'displayName',
        label: 'Display name',
    },
    {
        key: 'surname',
        label: 'Surname',
    },
    {
        key: 'firstName',
        label: 'First name',
    },
    {
        key: 'introduction',
        label: 'Introduction',
    },
    {
        key: 'jobTitle',
        label: 'Job title',
    },
    {
        key: 'employer',
        label: 'Works at',
    },
    {
        key: 'education',
        label: 'Education',
    },
    {
        key: 'interests',
        label: 'Interests',
    },
    {
        key: 'nationality',
        label: 'Nationality',
    },
    {
        key: 'birthday',
        label: 'Birthday',
        parseDate: true,
    },
    {
        key: 'gender',
        label: 'Gender',
        removeText: 'gender_',
    },
    {
        key: 'languages',
        label: 'Speaks',
    },
    {
        key: 'email',
        label: 'E-mail',
    },
    {
        key: 'phoneNumber',
        label: 'Mobile phone number',
    },
    {
        key: 'organisationUnits',
        label: 'Organisations units',
        parseArrayAsCommaDelimitedString: 'displayName',
    },
    {
        key: 'userCredentials',
        label: 'User roles',
        nestedPropselector: ['userRoles'],
        parseArrayAsCommaDelimitedString: 'displayName',
    },
];

export const LIST_FILTER = {
    query: '', // string
};

export const USER_LIST_FILTER = {
    query: '', // string
    inactiveMonths: null, // Number
    selfRegistered: false, // Bool
    invitationStatus: null, // 'all' || 'expired',
};

export const INITIAL_SNACKBAR_STATE = {
    show: false,
    props: {
        message: '',
    },
};

export const INITIAL_DIALOG_STATE = {
    show: false,
    props: {},
    content: null,
};
