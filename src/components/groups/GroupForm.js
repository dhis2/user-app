import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchableGroupEditor from '../SearchableGroupEditor';
import TextField from 'material-ui/TextField/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import i18next from 'i18next';
import { navigateTo } from '../../utils';
import api from '../../api';
import { getList, showSnackbar } from '../../actions';
import { USER_GROUP } from '../../constants/entityTypes';
import { asArray } from '../../utils';

class GroupForm extends Component {
    static propTypes = {
        group: PropTypes.object.isRequired,
        showSnackbar: PropTypes.func.isRequired,
        getList: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            groupName: props.group.displayName || '',
            groupNameError: null,
            submitting: false,
        };
        this.groupMembers = asArray(props.group.users).map(({ id }) => id);
        this.groupManagedGroups = asArray(props.group.managedGroups).map(({ id }) => id);
    }

    onUsersChange(assignedUserIds) {
        this.groupMembers = assignedUserIds;
    }

    onUserGroupChange(assignedUserGroupIds) {
        this.groupManagedGroups = assignedUserGroupIds;
    }

    onGroupNameInputChange(event) {
        const groupName = event.target.value;
        const groupNameError = !groupName ? i18next.t('Required') : null;

        this.setState({ groupName, groupNameError });
    }

    updateGroup() {
        const {
            props: { group },
            state: { groupName },
            groupMembers,
            groupManagedGroups,
        } = this;

        group.name = groupName;
        group.displayName = groupName;
        group.users = groupMembers.map(value => ({ id: value }));
        group.managedGroups = groupManagedGroups.map(value => ({ id: value }));

        this.setState({ submitting: true });

        group.save().then(() => this.onRequestComplete(!!group.id));
    }

    onRequestComplete(isUpdate) {
        const { showSnackbar, getList } = this.props;
        const message = isUpdate
            ? i18next.t('Group successfully updated')
            : i18next.t('Group successfully created');

        showSnackbar({ message });
        getList(USER_GROUP);
        this.backToList();
    }

    backToList() {
        navigateTo('/user-groups');
    }

    render() {
        const { group } = this.props;
        const { groupName, groupNameError, submitting } = this.state;
        const groupNameTxt = `${i18next.t('Name')} *`;

        return (
            <main>
                <TextField
                    fullWidth={true}
                    onChange={this.onGroupNameInputChange.bind(this)}
                    value={groupName}
                    floatingLabelText={groupNameTxt}
                    hintText={groupNameTxt}
                    errorText={groupNameError}
                    style={{ marginBottom: '1rem' }}
                />
                <SearchableGroupEditor
                    initiallyAssignedItems={group.users}
                    availableItemsQuery={api.getManagedUsers}
                    onChange={this.onUsersChange.bind(this)}
                    availableItemsHeader={i18next.t('Available users')}
                    assignedItemsHeader={i18next.t('Group members')}
                />
                <SearchableGroupEditor
                    initiallyAssignedItems={group.managedGroups}
                    availableItemsQuery={api.getAvailableUsergroups}
                    onChange={this.onUserGroupChange.bind(this)}
                    availableItemsHeader={i18next.t('Available user groups')}
                    assignedItemsHeader={i18next.t('Managed user groups')}
                />
                <div>
                    <RaisedButton
                        label={i18next.t('Save')}
                        primary={true}
                        onClick={this.updateGroup.bind(this)}
                        disabled={!!(groupNameError || submitting)}
                        style={{ marginRight: '8px' }}
                    />
                    <RaisedButton
                        label={i18next.t('Cancel')}
                        onClick={this.backToList.bind(this)}
                    />
                </div>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    group: state.currentItem,
});

export default connect(mapStateToProps, {
    showSnackbar,
    getList,
})(GroupForm);
