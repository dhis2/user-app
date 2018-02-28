import React from 'react';
import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
import { navigateTo } from '../../utils';
import store from '../../store';
import api from '../../api';
import { deleteModel } from '../../utils/sharedActions';
import { USER } from '../../constants/entityTypes';
import { showDialog, hideDialog, showSnackbar, getList } from '../../actions';
import ReplicateUserForm from './ReplicateUserForm';
import AssignSearchOrganisationUnits from './AssignSearchOrganisationUnits';

const profile = 'profile';
const edit = 'edit';
const assign_search_org_units = 'assign_search_org_units';
const remove = 'remove';
const replicate = 'replicate';
const disable = 'disable';
const enable = 'enable';

export const isUserContextActionAllowed = (model, action) => {
    if (!model) {
        return false;
    }

    if (action === disable && model.userCredentials.disabled) {
        return false;
    }

    if (action === enable && !model.userCredentials.disabled) {
        return false;
    }

    return true;
};

export const userContextMenuIcons = {
    [profile]: 'account_circle',
    [edit]: 'edit',
    [assign_search_org_units]: 'account_balance',
    [remove]: 'delete',
    [replicate]: 'content_copy',
    [disable]: 'block',
    [enable]: 'check',
};

export const userContextMenuActions = Action.createActionsFromNames([
    profile,
    edit,
    assign_search_org_units,
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

userContextMenuActions.assign_search_org_units.subscribe(({ data: user }) => {
    const content = <AssignSearchOrganisationUnits user={user} />;
    const props = {
        onRequestClose: () => store.dispatch(hideDialog()),
        title: i18next.t('Assign Search Organisation Units'),
        contentStyle: {
            minHeight: '100vh',
        },
    };
    store.dispatch(showDialog(content, props));
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

userContextMenuActions.disable.subscribe(({ data }) => {
    updateDisabledState(data, true);
});

userContextMenuActions.enable.subscribe(({ data }) => {
    updateDisabledState(data, false);
});

const updateDisabledState = ({ displayName, id }, disabledState) => {
    const enabledSuccessBaseMsg = i18next.t('successfully enabled');
    const disabledSuccessBaseMsg = i18next.t('sucessfully disabled');
    const errorMsg = i18next.t('There was a problem updating the enabled state');

    api
        .updateDisabledState(id, disabledState)
        .then(() => {
            const baseMsg = disabledState
                ? disabledSuccessBaseMsg
                : enabledSuccessBaseMsg;

            store.dispatch(showSnackbar({ message: `${displayName} ${baseMsg}` }));
            store.dispatch(getList(USER));
        })
        .catch(() => {
            store.dispatch(showSnackbar({ message: errorMsg }));
        });
};
