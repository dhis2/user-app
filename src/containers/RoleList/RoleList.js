import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { USER_ROLE } from '../../constants/entityTypes'
import List from '../../components/List'
import {
    roleContextMenuActions,
    roleContextMenuIcons,
    isRoleContextActionAllowed,
} from './RoleContextMenuActions'
import SearchFilter from '../../components/SearchFilter'

/**
 * Container component that renders a List component with correct properties for displaying a list of UserRoles
 * @class
 */
const RoleList = () => (
    <List
        entityType={USER_ROLE}
        FilterComponent={SearchFilter}
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
