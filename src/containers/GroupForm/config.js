import i18n from '@dhis2/d2-i18n'
import asArray from '../../utils/asArray'
import {
    renderText,
    renderTextField,
    renderSearchableGroupEditor,
} from '../../utils/fieldRenderers'

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
        fieldRenderer: renderText,
        label: i18n.t(
            'To add a user to this group, go to the User section and edit the user group settings for a specific user.'
        ),
        style: {
            border: '1px solid #bdbdbd',
            backgroundColor: '#e5e5e5',
            padding: 12,
        },
    },
    {
        name: MANAGED_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: group => asArray(group[MANAGED_GROUPS]),
        availableItemsQuery: {
            availableItems: {
                resource: 'userGroups',
                params: {
                    fields: ['id', 'displayName'],
                    paging: false,
                },
            },
        },
        availableItemsLabel: i18n.t('Available user groups'),
        assignedItemsLabel: i18n.t('Managed user groups'),
    },
]
