import i18n from 'd2-i18n';
import Action from 'd2-ui/lib/action/Action';
import navigateTo from '../../utils/navigateTo';
import api from '../../api';
import store from '../../store';
import { deleteModel, openSharingSettings } from '../../utils/sharedActions';
import { USER_GROUP } from '../../constants/entityTypes';
import { showSnackbar, getCurrentUserGroupMemberships } from '../../actions';

const show_details = 'show_details';
const sharing_settings = 'sharing_settings';
const edit = 'edit';
const join_group = 'join_group';
const leave_group = 'leave_group';
const remove = 'remove';

export const isGroupContextActionAllowed = (model, action) => {
    if (!model) {
        return false;
    }

    const { access } = model;

    switch (action) {
        case show_details:
            return access.read;
        case sharing_settings:
            return access.externalize;
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
    const joinSuccessBaseMsg = i18n.t('You joined group');
    const leaveSuccessBaseMsg = i18n.t('You left group');
    const errorMsg = i18n.t('There was a problem updating your group membership');

    try {
        await api.updateCurrentUserGroupMembership(id, deleteMembership);
        const baseMsg = deleteMembership ? leaveSuccessBaseMsg : joinSuccessBaseMsg;
        store.dispatch(showSnackbar({ message: `${baseMsg} ${displayName}` }));
        store.dispatch(getCurrentUserGroupMemberships());
    } catch (error) {
        store.dispatch(showSnackbar({ message: errorMsg }));
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
        confirmMsg: i18n.t('Are you sure you want to remove this user group?'),
        successMsg: i18n.t('User group removed succesfully'),
        errorMsg: i18n.t('There was a problem deleting the user group'),
        model: group,
        entityType: USER_GROUP,
    };
    deleteModel(params);
});
