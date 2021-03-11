import i18n from '@dhis2/d2-i18n'
import React from 'react'
import List from '../../components/List'
import SearchFilter from '../../components/SearchFilter'
import { USER_ROLE } from '../../constants/entityTypes'
import {
    roleContextMenuActions,
    roleContextMenuIcons,
    isRoleContextActionAllowed,
} from './RoleContextMenuActions'

/**
 * Container component that renders a List component with correct properties for displaying a list of UserRoles
 * @class
 */
const RoleList = () => (
    <List
        entityType={USER_ROLE}
        filterComponent={SearchFilter}
        columns={['displayName', 'description']}
        primaryAction={roleContextMenuActions.edit}
        contextMenuActions={roleContextMenuActions}
        contextMenuIcons={roleContextMenuIcons}
        isContextActionAllowed={isRoleContextActionAllowed}
        sectionName={i18n.t('User Role Management')}
        newItemPath={'/user-roles/new'}
        className={'role-list'}
    />
)

export default RoleList
