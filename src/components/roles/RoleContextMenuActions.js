import React from 'react';
import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
import { navigateTo } from '../../utils';
import store from '../../store';
import { removeEntity } from '../../utils/sharedActions';
import { getRoles, showDialog, hideDialog } from '../../actions';
import ReplicateUserForm from '../users/ReplicateUserForm';

export const isRoleContextActionAllowed = () => true;

export const roleContextMenuIcons = {
    profile: 'account_circle',
    edit: 'edit',
    assign_search_org_units: 'account_balance',
    remove: 'delete',
    replicate: 'content_copy',
    disable: 'block',
    enable: 'check',
};

export const roleContextMenuActions = Action.createActionsFromNames([
    'profile',
    'edit',
    'assign_search_org_units',
    'remove',
    'replicate',
    'disable',
    'enable',
]);

roleContextMenuActions.profile.subscribe(({ data: { id } }) => {
    navigateTo(`/users/view/${id}`);
});

roleContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/users/edit/${id}`);
});

roleContextMenuActions.assign_search_org_units.subscribe(action => {
    console.log('assignSearchOrgUnits: ', action);
});

roleContextMenuActions.remove.subscribe(({ data: role }) => {
    const params = {
        confirmMsg: i18next.t('Are you sure you want to remove this user role?'),
        successMsg: i18next.t('User role removed succesfully'),
        errorMsg: i18next.t('There was a problem deleting the user role'),
        entity: role,
        getList: getRoles,
    };
    removeEntity(params);
});

roleContextMenuActions.replicate.subscribe(({ data: { id } }) => {
    const content = <ReplicateUserForm userIdToReplicate={id} />;
    const props = {
        onRequestClose: () => store.dispatch(hideDialog()),
        title: i18next.t('Replicate user'),
    };
    store.dispatch(showDialog(content, props));
});

roleContextMenuActions.disable.subscribe(action => {
    console.log('disable: ', action);
});

roleContextMenuActions.enable.subscribe(action => {
    console.log('enable: ', action);
});
