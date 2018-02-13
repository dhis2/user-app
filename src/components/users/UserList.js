import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import List from '../List';

import {
    userContextMenuActions,
    userContextMenuIcons,
    isUserContextActionAllowed,
} from './UserContextMenuActions';
import UserFilter from './UserFilter';

class UserList extends Component {
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
                entityType={USER}
                columns={['displayName', 'userName']}
                FilterComponent={UserFilter}
                primaryAction={this.selectUserAndGoToNextPage.bind(this)}
                contextMenuActions={userContextMenuActions}
                contextMenuIcons={userContextMenuIcons}
                isContextActionAllowed={isUserContextActionAllowed}
            />
        );
    }
}

export default UserList;
