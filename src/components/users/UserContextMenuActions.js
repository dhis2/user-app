import React from 'react';
import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
import { navigateTo } from '../../utils';
import store from '../../store';
import { deleteModel } from '../../utils/sharedActions';
import { USER } from '../../constants/entityTypes';
import { showDialog, hideDialog } from '../../actions';
import ReplicateUserForm from './ReplicateUserForm';

export const isUserContextActionAllowed = () => true;

export const userContextMenuIcons = {
    profile: 'account_circle',
    edit: 'edit',
    assign_search_org_units: 'account_balance',
    remove: 'delete',
    replicate: 'content_copy',
    disable: 'block',
    enable: 'check',
};

export const userContextMenuActions = Action.createActionsFromNames([
    'profile',
    'edit',
    'assign_search_org_units',
    'remove',
    'replicate',
    'disable',
    'enable',
]);

userContextMenuActions.profile.subscribe(({ data: { id } }) => {
    navigateTo(`/users/view/${id}`);
});

userContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/users/edit/${id}`);
});

userContextMenuActions.assign_search_org_units.subscribe(action => {
    console.log('assignSearchOrgUnits: ', action);
});

userContextMenuActions.remove.subscribe(({ data: user }) => {
    const params = {
        confirmMsg: i18next.t('Are you sure you want to remove this user?'),
        successMsg: i18next.t('User removed succesfully'),
        errorMsg: i18next.t('There was a problem deleting the user'),
        model: user,
        entityType: USER,
    };
    deleteModel(params);
});

userContextMenuActions.replicate.subscribe(({ data: { id } }) => {
    const content = <ReplicateUserForm userIdToReplicate={id} />;
    const props = {
        onRequestClose: () => store.dispatch(hideDialog()),
        title: i18next.t('Replicate user'),
    };
    store.dispatch(showDialog(content, props));
});

userContextMenuActions.disable.subscribe(action => {
    console.log('disable: ', action);
});

userContextMenuActions.enable.subscribe(action => {
    console.log('enable: ', action);
});
