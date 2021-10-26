import i18n from '@dhis2/d2-i18n'
import asArray from '../../utils/asArray'
import {
    renderTextField,
    renderSearchableGroupEditor,
} from '../../utils/fieldRenderers'
import BulkUserManager from './BulkUserManager/BulkUserManager'

export const FORM_NAME = 'groupForm'
export const NAME = 'name'
export const CODE = 'code'
export const MANAGED_GROUPS = 'managedGroups'

export const GROUP_PROPS = [NAME, CODE, MANAGED_GROUPS]

export const STYLES = {
    loaderWrap: {
        paddingTop: '2rem',
        textAlign: 'center',
    },
}

export const getFields = () => [
    {
        name: NAME,
        label: i18n.t('Name'),
        fieldRenderer: renderTextField,
        isRequiredField: true,
    },
    {
        name: CODE,
        label: i18n.t('Code'),
        fieldRenderer: renderTextField,
    },
    {
        name: 'manage_users_info',
        component: BulkUserManager,
    },
    {
        name: MANAGED_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: group => asArray(group[MANAGED_GROUPS]),
        availableItemsQuery: 'getAvailableUserGroups',
        availableItemsLabel: i18n.t('Available user groups'),
        assignedItemsLabel: i18n.t('Managed user groups'),
    },
]
