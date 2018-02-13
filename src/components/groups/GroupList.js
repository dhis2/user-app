import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '../List';
import {
    isGroupContextActionAllowed,
    groupContextMenuIcons,
    groupContextMenuActions,
} from './GroupContextMenuActions';
import { USER_GROUP } from '../../constants/entityTypes';
import SearchFilter from '../SearchFilter';

class GroupList extends Component {
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
                entityType={USER_GROUP}
                FilterComponent={SearchFilter}
                columns={['displayName']}
                primaryAction={this.selectUserAndGoToNextPage.bind(this)}
                contextMenuActions={groupContextMenuActions}
                contextMenuIcons={groupContextMenuIcons}
                isContextActionAllowed={isGroupContextActionAllowed}
            />
        );
    }
}

export default GroupList;
