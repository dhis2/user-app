import i18n from '@dhis2/d2-i18n'

const BASE_FIELDS = [
    {
        key: 'displayName',
        label: i18n.t('Display name'),
    },
    {
        key: 'id',
        label: i18n.t('ID'),
    },
]

export const USER_PROFILE = [
    ...BASE_FIELDS,
    {
        key: 'userCredentials',
        nestedPropselector: ['lastLogin'],
        label: i18n.t('Last login'),
        parseDateTime: true,
    },
    {
        key: 'created',
        label: i18n.t('Created'),
        parseDate: true,
    },
    {
        key: 'surname',
        label: i18n.t('Surname'),
    },
    {
        key: 'firstName',
        label: i18n.t('First name'),
    },
    {
        key: 'introduction',
        label: i18n.t('Introduction'),
    },
    {
        key: 'jobTitle',
        label: i18n.t('Job title'),
    },
    {
        key: 'employer',
        label: i18n.t('Works at'),
    },
    {
        key: 'education',
        label: i18n.t('Education'),
    },
    {
        key: 'interests',
        label: i18n.t('Interests'),
    },
    {
        key: 'nationality',
        label: i18n.t('Nationality'),
    },
    {
        key: 'birthday',
        label: i18n.t('Birthday'),
        parseDate: true,
    },
    {
        key: 'gender',
        label: i18n.t('Gender'),
        removeText: 'gender_',
    },
    {
        key: 'languages',
        label: i18n.t('Speaks'),
    },
    {
        key: 'email',
        label: i18n.t('E-mail'),
    },
    {
        key: 'phoneNumber',
        label: i18n.t('Mobile phone number'),
    },
    {
        key: 'organisationUnits',
        label: i18n.t('Organisations units'),
        parseArrayAsCommaDelimitedString: 'displayName',
    },
    {
        key: 'userCredentials',
        label: i18n.t('User roles'),
        nestedPropselector: ['userRoles'],
        parseArrayAsCommaDelimitedString: 'displayName',
    },
]

export const USER_ROLE_DETAILS = [
    ...BASE_FIELDS,
    {
        key: 'users',
        label: i18n.t('Members'),
        count: true,
    },
]
export const USER_GROUP_DETAILS = [
    ...BASE_FIELDS,
    {
        key: 'users',
        label: i18n.t('Number of users'),
        count: true,
    },
]
