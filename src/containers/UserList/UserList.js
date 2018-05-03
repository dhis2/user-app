import React from 'react';
import { USER } from '../../constants/entityTypes';
import List from '../../components/List';
import i18n from 'd2-i18n';

import {
    userContextMenuActions,
    userContextMenuIcons,
    isUserContextActionAllowed,
} from './UserContextMenuActions';
import UserFilter from './UserFilter';

/**
 * Container component that renders a List component with correct properties for displaying a list of Users
 */
const UserList = () => (
    <List
        entityType={USER}
        columns={['displayName', 'userName', 'disabled']}
        FilterComponent={UserFilter}
        primaryAction={userContextMenuActions.edit}
        contextMenuActions={userContextMenuActions}
        contextMenuIcons={userContextMenuIcons}
        isContextActionAllowed={isUserContextActionAllowed}
        sectionName={i18n.t('User Management')}
        newItemPath={'/users/new'}
        className="user-list"
    />
);

export default UserList;
