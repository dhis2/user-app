import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import List from '../List';
import i18next from 'i18next';

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

    render() {
        return (
            <List
                entityType={USER}
                columns={['displayName', 'userName']}
                FilterComponent={UserFilter}
                primaryAction={userContextMenuActions.edit}
                contextMenuActions={userContextMenuActions}
                contextMenuIcons={userContextMenuIcons}
                isContextActionAllowed={isUserContextActionAllowed}
                sectionName={i18next.t('User Management')}
            />
        );
    }
}

export default UserList;
