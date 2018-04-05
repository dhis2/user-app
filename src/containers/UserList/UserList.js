import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import List from '../../components/List';
import i18next from 'i18next';

import {
    userContextMenuActions,
    userContextMenuIcons,
    isUserContextActionAllowed,
} from './UserContextMenuActions';
import UserFilter from './UserFilter';

class UserList extends Component {
    render() {
        return (
            <List
                entityType={USER}
                columns={['displayName', 'userName', 'disabled']}
                FilterComponent={UserFilter}
                primaryAction={userContextMenuActions.edit}
                contextMenuActions={userContextMenuActions}
                contextMenuIcons={userContextMenuIcons}
                isContextActionAllowed={isUserContextActionAllowed}
                sectionName={i18next.t('User Management')}
                newItemPath={'/users/new'}
                className="user-list"
            />
        );
    }
}

UserList.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default UserList;
