import React from 'react';
import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
import { navigateTo } from '../../utils';
import store from '../../store';
import { removeEntity } from '../../utils/sharedActions';
import { getGroups, showDialog, hideDialog } from '../../actions';
import ReplicateUserForm from '../users/ReplicateUserForm';

export const isGroupContextActionAllowed = () => true;

export const groupContextMenuIcons = {
    profile: 'account_circle',
    edit: 'edit',
    assign_search_org_units: 'account_balance',
    remove: 'delete',
    replicate: 'content_copy',
    disable: 'block',
    enable: 'check',
};

export const groupContextMenuActions = Action.createActionsFromNames([
    'profile',
    'edit',
    'assign_search_org_units',
    'remove',
    'replicate',
    'disable',
    'enable',
]);

groupContextMenuActions.profile.subscribe(({ data: { id } }) => {
    navigateTo(`/users/view/${id}`);
});

groupContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/users/edit/${id}`);
});

groupContextMenuActions.assign_search_org_units.subscribe(action => {
    console.log('assignSearchOrgUnits: ', action);
});

groupContextMenuActions.remove.subscribe(({ data: group }) => {
    const params = {
        confirmMsg: i18next.t('Are you sure you want to remove this user group?'),
        successMsg: i18next.t('User group removed succesfully'),
        errorMsg: i18next.t('There was a problem deleting the user group'),
        entity: group,
        getList: getGroups,
    };
    removeEntity(params);
});

groupContextMenuActions.replicate.subscribe(({ data: { id } }) => {
    const content = <ReplicateUserForm userIdToReplicate={id} />;
    const props = {
        onRequestClose: () => store.dispatch(hideDialog()),
        title: i18next.t('Replicate user'),
    };
    store.dispatch(showDialog(content, props));
});

groupContextMenuActions.disable.subscribe(action => {
    console.log('disable: ', action);
});

groupContextMenuActions.enable.subscribe(action => {
    console.log('enable: ', action);
});
