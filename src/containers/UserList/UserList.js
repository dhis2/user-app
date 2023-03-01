import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import List from '../../components/List'
import { USER } from '../../constants/entityTypes'
import {
    userContextMenuActions,
    userContextMenuIcons,
    isUserContextActionAllowed,
} from './UserContextMenuActions'
import UserFilter from './UserFilter'

/**
 * Container component that renders a List component with correct properties for displaying a list of Users
 * @class
 */
const UserList = () => {
    const { fromServerDate } = useTimeZoneConversion()
    return (
        <List
            entityType={USER}
            columns={['displayName', 'userName', 'lastLogin', 'disabled']}
            filterComponent={UserFilter}
            primaryAction={userContextMenuActions.edit}
            contextMenuActions={userContextMenuActions}
            contextMenuIcons={userContextMenuIcons}
            isContextActionAllowed={isUserContextActionAllowed}
            sectionName={i18n.t('User Management')}
            newItemPath={'/users/new'}
            className="user-list"
            fromServerDate={fromServerDate}
        />
    )
}

export default UserList
