import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGroups } from '../../actions';
import List from '../List';
import {
    isGroupContextActionAllowed,
    groupContextMenuIcons,
    groupContextMenuActions,
} from './GroupContextMenuActions';
import SearchFilter from '../SearchFilter';

class GroupList extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        users: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        getGroups: PropTypes.func.isRequired,
    };

    selectUserAndGoToNextPage(user) {
        const { history } = this.props;
        const { id } = user;
        history.push(`/users/edit/${id}`);
    }

    render() {
        const { getGroups } = this.props;
        return (
            <List
                getItems={getGroups}
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

export default connect(null, {
    getGroups,
})(GroupList);
