import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER_ROLE } from '../../constants/entityTypes';
import List from '../List';
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

    selectUserAndGoToNextPage(user) {
        const { history } = this.props;
        const { id } = user;
        history.push(`/users/edit/${id}`);
    }

    render() {
        return (
            <List
                entityType={USER_ROLE}
                FilterComponent={SearchFilter}
                columns={['displayName', 'description']}
                primaryAction={this.selectUserAndGoToNextPage.bind(this)}
                contextMenuActions={roleContextMenuActions}
                contextMenuIcons={roleContextMenuIcons}
                isContextActionAllowed={isRoleContextActionAllowed}
            />
        );
    }
}

export default RoleList;
