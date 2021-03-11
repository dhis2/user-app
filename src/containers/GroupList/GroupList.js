import i18n from '@dhis2/d2-i18n'
import React, { Component } from 'react'
import List from '../../components/List'
import SearchFilter from '../../components/SearchFilter'
import { USER_GROUP } from '../../constants/entityTypes'
import {
    isGroupContextActionAllowed,
    groupContextMenuIcons,
    groupContextMenuActions,
} from './GroupContextMenuActions'

/**
 * Container component that renders a List component with correct properties for displaying a list of UserGroups
 */
class GroupList extends Component {
    render() {
        return (
            <List
                entityType={USER_GROUP}
                filterComponent={SearchFilter}
                columns={['displayName', 'currentUserIsMember']}
                primaryAction={groupContextMenuActions.edit}
                contextMenuActions={groupContextMenuActions}
                contextMenuIcons={groupContextMenuIcons}
                isContextActionAllowed={isGroupContextActionAllowed}
                sectionName={i18n.t('User Group Management')}
                newItemPath={'/user-groups/new'}
                className={'group-list'}
            />
        )
    }
}

export default GroupList
