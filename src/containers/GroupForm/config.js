import { renderTextField, renderSearchableGroupEditor } from '../../utils/fieldRenderers';
import asArray from '../../utils/asArray';

export const NAME = 'name';
export const USERS = 'users';
export const MANAGED_GROUPS = 'managedGroups';

export const GROUP_PROPS = [NAME, USERS, MANAGED_GROUPS];

export const FIELDS = [
    {
        name: NAME,
        label: 'Name',
        fieldRenderer: renderTextField,
        isRequiredField: true,
    },
    {
        name: USERS,
        fieldRenderer: renderSearchableGroupEditor,
        isRequiredField: true,
        initialItemsSelector: group => asArray(group[USERS]),
        availableItemsQuery: 'getManagedUsers',
        availableItemsLabel: 'Available users',
        assignedItemsLabel: 'Group members',
    },
    {
        name: MANAGED_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: group => asArray(group[MANAGED_GROUPS]),
        availableItemsQuery: 'getAvailableUserGroups',
        availableItemsLabel: 'Available user groups',
        assignedItemsLabel: 'Managed user groups',
    },
];
