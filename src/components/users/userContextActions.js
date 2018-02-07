import React from 'react';
import Action from 'd2-ui/lib/action/Action';
import _ from '../../constants/lodash';
import i18next from 'i18next';
import ReplicateUserForm from './ReplicateUserForm';

const createUserContextActions = parentProps => {
    let userContextMenu = new UserContextMenu(parentProps);
    return {
        contextMenuActions: userContextMenu.actions,
        contextMenuIcons: userContextMenu.icons,
        isContextActionAllowed: userContextMenu.isActionAllowed,
    };
};

class UserContextMenu {
    constructor(parentProps) {
        this.parentProps = parentProps;
        this.setActions();
        this.setIcons();
    }

    setActions() {
        this.actions = Action.createActionsFromNames([
            'profile',
            'edit',
            'assign_search_org_units',
            'remove',
            'replicate',
            'disable',
            'enable',
        ]);
        Object.keys(this.actions).forEach(actionName => {
            const handlerName = `${_.camelCase(actionName)}ActionHandler`;
            const actionHandler = this[handlerName].bind(this);
            this.actions[actionName].subscribe(action => {
                actionHandler(action);
            });
        });
    }

    setIcons() {
        this.icons = {
            profile: 'account_circle',
            edit: 'edit',
            assign_search_org_units: 'account_balance',
            remove: 'delete',
            replicate: 'content_copy',
            disable: 'block',
            enable: 'check',
        };
    }

    isActionAllowed(action) {
        return true;
    }

    profileActionHandler({ data: { id } }) {
        const { history } = this.parentProps;
        history.push(`/users/view/${id}`);
    }

    editActionHandler({ data: { id } }) {
        const { history } = this.parentProps;
        history.push(`/users/edit/${id}`);
    }

    assignSearchOrgUnitsActionHandler(action) {
        console.log('assignSearchOrgUnits: ', action);
    }

    removeActionHandler(action) {
        const user = action.data;
        const { showSnackbar } = this.parentProps;
        const snackbarProps = {
            message: i18next.t('Are you sure you want to remove this user?'),
            action: i18next.t('Confirm'),
            autoHideDuration: null,
            onActionClick: () => this.removeConfirmHandler(user),
        };
        showSnackbar(snackbarProps);
    }

    removeConfirmHandler(user) {
        const { getUsers, hideSnackbar, showSnackbar } = this.parentProps;
        hideSnackbar();
        user
            .delete()
            .then(() => {
                showSnackbar({
                    autoHideDuration: 3000,
                    message: i18next.t('User removed succesfully'),
                });
                getUsers();
            })
            .catch(() => {
                showSnackbar({
                    autoHideDuration: 3000,
                    message: i18next.t('There was a problem deleting the user'),
                });
            });
    }

    replicateActionHandler({ data: { id } }) {
        const { showDialog, hideDialog } = this.parentProps;
        const content = <ReplicateUserForm userIdToReplicate={id} />;
        const props = {
            onRequestClose: hideDialog,
            title: i18next.t('Replicate user'),
        };
        showDialog(content, props);
    }

    disableActionHandler(action) {
        console.log('disable: ', action);
    }

    enableActionHandler(action) {
        console.log('enable: ', action);
    }
}

export default createUserContextActions;
