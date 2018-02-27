import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER_ROLE } from '../../constants/entityTypes';
import List from '../List';
import i18next from 'i18next';
import {
    roleContextMenuActions,
    roleContextMenuIcons,
    isRoleContextActionAllowed,
} from './RoleContextMenuActions';
import SearchFilter from '../SearchFilter';

class RoleList extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    render() {
        return (
            <List
                entityType={USER_ROLE}
                FilterComponent={SearchFilter}
                columns={['displayName', 'description']}
                primaryAction={roleContextMenuActions.edit}
                contextMenuActions={roleContextMenuActions}
                contextMenuIcons={roleContextMenuIcons}
                isContextActionAllowed={isRoleContextActionAllowed}
                sectionName={i18next.t('User Role Management')}
            />
        );
    }
}

export default RoleList;
