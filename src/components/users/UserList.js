import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUsers } from '../../actions';
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
        users: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        getUsers: PropTypes.func.isRequired,
    };

    selectUserAndGoToNextPage(user) {
        const { history } = this.props;
        const { id } = user;
        history.push(`/users/edit/${id}`);
    }

    render() {
        const { getUsers } = this.props;
        return (
            <List
                getItems={getUsers}
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

export default connect(null, {
    getUsers,
})(UserList);
