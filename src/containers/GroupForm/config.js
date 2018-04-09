import { renderTextField, renderSearchableGroupEditor } from '../../utils/fieldRenderers';
import asArray from '../../utils/asArray';
import i18n from 'd2-i18n';

export const NAME = 'name';
export const USERS = 'users';
export const MANAGED_GROUPS = 'managedGroups';

export const GROUP_PROPS = [NAME, USERS, MANAGED_GROUPS];

export const FIELDS = [
    {
        name: NAME,
        label: i18n.t('Name'),
        fieldRenderer: renderTextField,
        isRequiredField: true,
    },
    {
        name: USERS,
        fieldRenderer: renderSearchableGroupEditor,
        isRequiredField: true,
        initialItemsSelector: group => asArray(group[USERS]),
        availableItemsQuery: 'getManagedUsers',
        availableItemsLabel: i18n.t('Available users'),
        assignedItemsLabel: i18n.t('Group members'),
    },
    {
        name: MANAGED_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: group => asArray(group[MANAGED_GROUPS]),
        availableItemsQuery: 'getAvailableUserGroups',
        availableItemsLabel: i18n.t('Available user groups'),
        assignedItemsLabel: i18n.t('Managed user groups'),
    },
];
