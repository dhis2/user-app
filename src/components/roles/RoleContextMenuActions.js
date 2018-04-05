import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
import { navigateTo } from '../../utils';
import { USER_ROLE } from '../../constants/entityTypes';
import { deleteModel, openSharingSettings } from '../../utils/sharedActions';

const show_details = 'show_details';
const sharing_settings = 'sharing_settings';
const edit = 'edit';
const remove = 'remove';

export const isRoleContextActionAllowed = (model, action) => {
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
        case remove:
            return access.delete;
        default:
            return true;
    }
};

export const roleContextMenuIcons = {
    [show_details]: 'info',
    [sharing_settings]: 'share',
    [edit]: 'edit',
    [remove]: 'delete',
};

export const roleContextMenuActions = Action.createActionsFromNames([
    [show_details],
    [sharing_settings],
    [edit],
    [remove],
]);

roleContextMenuActions.show_details.subscribe(({ data: { id } }) => {
    navigateTo(`/user-roles/view/${id}`);
});

roleContextMenuActions.sharing_settings.subscribe(openSharingSettings);

roleContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/user-roles/edit/${id}`);
});

roleContextMenuActions.remove.subscribe(({ data: role }) => {
    const params = {
        confirmMsg: i18next.t('Are you sure you want to remove this user role?'),
        successMsg: i18next.t('User role removed succesfully'),
        errorMsg: i18next.t('There was a problem deleting the user role'),
        model: role,
        entityType: USER_ROLE,
    };
    deleteModel(params);
});
