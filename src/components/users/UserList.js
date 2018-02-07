import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getUsers,
    showSnackbar,
    hideSnackbar,
    showDialog,
    hideDialog,
} from '../../actions';
import List from '../List';
import createUserContextActions from './userContextActions';
import UserFilter from './UserFilter';

class UserList extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        users: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        getUsers: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const contextActions = createUserContextActions(props);
        Object.assign(this, contextActions);
    }

    selectUserAndGoToNextPage(user) {
        const { history } = this.props;
        const { id } = user;
        history.push(`/users/edit/${id}`);
    }

    render() {
        console.log(this.props);
        const { getUsers } = this.props;
        return (
            <List
                createContextActions={createUserContextActions}
                getItems={getUsers}
                FilterComponent={UserFilter}
                primaryAction={this.selectUserAndGoToNextPage.bind(this)}
                contextMenuActions={this.contextMenuActions}
                contextMenuIcons={this.contextMenuIcons}
                isContextActionAllowed={this.isContextActionAllowed}
            />
        );
    }
}

export default connect(null, {
    getUsers,
    showSnackbar,
    hideSnackbar,
    showDialog,
    hideDialog,
})(UserList);
