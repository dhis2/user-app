import React from 'react';
import Action from 'd2-ui/lib/action/Action';
import { navigateTo } from '../../utils';
import store from '../../store';
import {
    getUsers,
    showSnackbar,
    hideSnackbar,
    showDialog,
    hideDialog,
} from '../../actions';
import i18next from 'i18next';
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

roleContextMenuActions.remove.subscribe(({ data: user }) => {
    const snackbarProps = {
        message: i18next.t('Are you sure you want to remove this user?'),
        action: i18next.t('Confirm'),
        autoHideDuration: null,
        onActionClick: () => onRemoveConfirm(user),
    };
    store.dispatch(showSnackbar(snackbarProps));
});

const onRemoveConfirm = user => {
    const successMsg = i18next.t('User removed succesfully');
    const errorMsg = i18next.t('There was a problem deleting the user');

    store.dispatch(hideSnackbar());

    user
        .delete()
        .then(() => {
            store.dispatch(showSnackbar({ message: successMsg }));
            store.dispatch(getUsers());
        })
        .catch(() => {
            store.dispatch(showSnackbar({ message: errorMsg }));
        });
};

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
