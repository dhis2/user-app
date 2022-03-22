// TODO: delete file

import i18n from '@dhis2/d2-i18n'

const getBaseFields = () => [
    {
        key: 'displayName',
        label: i18n.t('Display name'),
    },
    {
        key: 'id',
        label: i18n.t('ID'),
    },
]

export const getUserRoleDetails = () => [
    ...getBaseFields(),
    {
        key: 'users',
        label: i18n.t('Members'),
        count: true,
    },
]
export const getUserGroupDetails = () => [
    ...getBaseFields(),
    {
        key: 'users',
        label: i18n.t('Number of users'),
        count: true,
    },
]
