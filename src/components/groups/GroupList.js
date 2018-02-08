import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getGroups,
    showSnackbar,
    hideSnackbar,
    showDialog,
    hideDialog,
} from '../../actions';
import List from '../List';
import GroupContextMenuActions from './GroupContextMenuActions';
import SearchFilter from '../SearchFilter';

class GroupList extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        users: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        getGroups: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const contextActions = GroupContextMenuActions.create(props);
        Object.assign(this, contextActions);
    }

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
                contextMenuActions={this.contextMenuActions}
                contextMenuIcons={this.contextMenuIcons}
                isContextActionAllowed={this.isContextActionAllowed}
            />
        );
    }
}

export default connect(null, {
    getGroups,
    showSnackbar,
    hideSnackbar,
    showDialog,
    hideDialog,
})(GroupList);
