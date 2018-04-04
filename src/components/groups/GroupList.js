import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '../List';
import i18next from 'i18next';
import {
    isGroupContextActionAllowed,
    groupContextMenuIcons,
    groupContextMenuActions,
} from './GroupContextMenuActions';
import { getCurrentUserGroupMemberships } from '../../actions';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import { USER_GROUP } from '../../constants/entityTypes';
import SearchFilter from '../SearchFilter';
import ErrorMessage from '../ErrorMessage';

class GroupList extends Component {
    componentWillMount() {
        const { groupMemberships, getCurrentUserGroupMemberships } = this.props;
        if (!groupMemberships) {
            getCurrentUserGroupMemberships();
        }
    }

    render() {
        const { groupMemberships } = this.props;
        if (typeof groupMemberships === 'string') {
            const introText = 'There was an error fetching the user list:';
            return <ErrorMessage introText={introText} errorMessage={groupMemberships} />;
        }

        if (groupMemberships === null) {
            return <LoadingMask />;
        }

        return (
            <List
                entityType={USER_GROUP}
                FilterComponent={SearchFilter}
                columns={['displayName', 'currentUserIsMember']}
                primaryAction={groupContextMenuActions.edit}
                contextMenuActions={groupContextMenuActions}
                contextMenuIcons={groupContextMenuIcons}
                isContextActionAllowed={isGroupContextActionAllowed}
                sectionName={i18next.t('User Group Management')}
                newItemPath={'/user-groups/new'}
                className={'group-list'}
            />
        );
    }
}

GroupList.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    getCurrentUserGroupMemberships: PropTypes.func.isRequired,
    groupMemberships: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

const mapStateToProps = state => {
    return {
        groupMemberships: state.currentUser.userGroups,
    };
};

export default connect(mapStateToProps, {
    getCurrentUserGroupMemberships,
})(GroupList);
