export const USER_PROFILE = [
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

export const USER_ROLE_DETAILS = [
    {
        key: 'displayName',
        label: 'Display name',
    },
    {
        key: 'users',
        label: 'Members',
        count: true,
    },
    {
        key: 'id',
        label: 'ID',
    },
];
export const USER_GROUP_DETAILS = [...USER_ROLE_DETAILS];
