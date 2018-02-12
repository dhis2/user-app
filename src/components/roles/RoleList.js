import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRoles } from '../../actions';
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
        users: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        getRoles: PropTypes.func.isRequired,
    };

    selectUserAndGoToNextPage(user) {
        const { history } = this.props;
        const { id } = user;
        history.push(`/users/edit/${id}`);
    }

    render() {
        const { getRoles } = this.props;
        return (
            <List
                getItems={getRoles}
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

export default connect(null, {
    getRoles,
})(RoleList);
