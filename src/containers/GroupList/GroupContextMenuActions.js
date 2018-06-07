/**
 * Defines the GroupList context menu for current user on a given UserGroup model instance.
 * Contains definitions for menu item visibility, individual menu item actions, icons and names.
 * @module containers/GroupList/GroupContextMenuActions
 */
import i18n from '@dhis2/d2-i18n';
import Action from 'd2-ui/lib/action/Action';
import navigateTo from '../../utils/navigateTo';
import api from '../../api';
import store from '../../store';
import { deleteModel, openSharingSettings } from '../../utils/sharedActions';
import { USER_GROUP } from '../../constants/entityTypes';
import { showSnackbar, refreshCurrentUser } from '../../actions';
import createHumanErrorMessage from '../../utils/createHumanErrorMessage';
const show_details = 'show_details';
const sharing_settings = 'sharing_settings';
const edit = 'edit';
const join_group = 'join_group';
const leave_group = 'leave_group';
const remove = 'remove';

/**
 * Determines whether a specific user group action should be visible for current user and given UserGroup instance
 * @param {Object} model - d2 UserGroup model instance
 * @param {String} action - Action name
 * @returns {Boolean} - Action visibility
 * @function
 */
export const isGroupContextActionAllowed = (model, action) => {
    if (!model) {
        return false;
    }

    const { access } = model;

    switch (action) {
        case show_details:
            return access.read;
        case sharing_settings:
            return access.manage;
        case edit:
            return access.update;
        case join_group:
            return access.update && !model.currentUserIsMember;
        case leave_group:
            return access.update && model.currentUserIsMember;
        case remove:
            return access.delete;
        default:
            return true;
    }
};

export const groupContextMenuIcons = {
    [show_details]: 'info',
    [sharing_settings]: 'share',
    [edit]: 'edit',
    [join_group]: 'group_add',
    [leave_group]: 'exit_to_app',
    [remove]: 'delete',
};

export const groupContextMenuActions = Action.createActionsFromNames([
    show_details,
    sharing_settings,
    edit,
    join_group,
    leave_group,
    remove,
]);

const updateGroupMembership = async ({ displayName, id }, deleteMembership) => {
    try {
        await api.updateCurrentUserGroupMembership(id, deleteMembership);
        const baseMsg = deleteMembership
            ? i18n.t('You left group')
            : i18n.t('You joined group');
        store.dispatch(showSnackbar({ message: `${baseMsg} ${displayName}` }));
        store.dispatch(refreshCurrentUser());
    } catch (error) {
        store.dispatch(
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t('There was a problem updating your group membership')
                ),
            })
        );
    }
};

groupContextMenuActions.show_details.subscribe(({ data: { id } }) => {
    navigateTo(`/user-groups/view/${id}`);
});

groupContextMenuActions.sharing_settings.subscribe(openSharingSettings);

groupContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/user-groups/edit/${id}`);
});

groupContextMenuActions.join_group.subscribe(({ data }) => {
    updateGroupMembership(data, false);
});

groupContextMenuActions.leave_group.subscribe(({ data }) => {
    updateGroupMembership(data, true);
});

groupContextMenuActions.remove.subscribe(({ data: group }) => {
    const params = {
        model: group,
        entityType: USER_GROUP,
    };
    deleteModel(params);
});
