/**
 * Defines the UserList context menu for current user on a given UserUser model instance.
 * Contains definitions for menu item visibility, individual menu item actions, icons and names.
 * @module containers/UserList/UserContextMenuActions
 */

import React from 'react';
import i18n from '@dhis2/d2-i18n';
import Action from 'd2-ui/lib/action/Action';
import navigateTo from '../../utils/navigateTo';
import store from '../../store';
import api from '../../api';
import { deleteModel } from '../../utils/sharedActions';
import { USER } from '../../constants/entityTypes';
import { showDialog, hideDialog, showSnackbar, getList } from '../../actions';
import ReplicateUserForm from '../../components/ReplicateUserForm';

const profile = 'profile';
const edit = 'edit';
const remove = 'remove';
const replicate = 'replicate';
const disable = 'disable';
const enable = 'enable';

/**
 * Determines whether a specific user action should be visible for current user and given User instance
 * @param {Object} model - d2 User model instance
 * @param {String} action - Action name
 * @returns {Boolean} - Action visibility
 * @function
 */
export const isUserContextActionAllowed = (model, action) => {
    if (!model) {
        return false;
    }

    const {
        access,
        userCredentials: { disabled },
    } = model;

    switch (action) {
        case profile:
            return access.read;
        case edit:
            return access.update;
        case remove:
            return access.delete;
        case replicate: {
            const currentUser = api.getCurrentUser();
            const userModelDefinition = api.getModelDefinition(USER);
            return access.update && currentUser.canCreate(userModelDefinition);
        }
        case disable:
            return access.update && !disabled;
        case enable:
            return access.update && disabled;
        default:
            return true;
    }
};

export const userContextMenuIcons = {
    [profile]: 'account_circle',
    [edit]: 'edit',
    [remove]: 'delete',
    [replicate]: 'content_copy',
    [disable]: 'block',
    [enable]: 'check',
};

export const userContextMenuActions = Action.createActionsFromNames([
    profile,
    edit,
    remove,
    replicate,
    disable,
    enable,
]);

userContextMenuActions.profile.subscribe(({ data: { id } }) => {
    navigateTo(`/users/view/${id}`);
});

userContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/users/edit/${id}`);
});

userContextMenuActions.remove.subscribe(({ data: user }) => {
    const params = {
        confirmMsg: i18n.t('Are you sure you want to remove this user?'),
        successMsg: i18n.t('User removed succesfully'),
        errorMsg: i18n.t('There was a problem deleting the user'),
        model: user,
        entityType: USER,
    };
    deleteModel(params);
});

userContextMenuActions.replicate.subscribe(({ data: { id } }) => {
    const content = <ReplicateUserForm userIdToReplicate={id} />;
    const props = {
        onRequestClose: () => store.dispatch(hideDialog()),
        title: i18n.t('Replicate user'),
    };
    store.dispatch(showDialog(content, props));
});

userContextMenuActions.disable.subscribe(({ data }) => {
    updateDisabledState(data, true);
});

userContextMenuActions.enable.subscribe(({ data }) => {
    updateDisabledState(data, false);
});

const updateDisabledState = async ({ displayName, id }, disabledState) => {
    const enabledSuccessBaseMsg = i18n.t('successfully enabled');
    const disabledSuccessBaseMsg = i18n.t('sucessfully disabled');
    const errorMsg = i18n.t('There was a problem updating the enabled state');

    try {
        await api.updateDisabledState(id, disabledState);
        const baseMsg = disabledState ? disabledSuccessBaseMsg : enabledSuccessBaseMsg;
        store.dispatch(showSnackbar({ message: `${displayName} ${baseMsg}` }));
        store.dispatch(getList(USER));
    } catch (error) {
        store.dispatch(showSnackbar({ message: errorMsg }));
    }
};
