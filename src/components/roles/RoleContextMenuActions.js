import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
// import { navigateTo } from '../../utils';
// import store from '../../store';
import { USER_ROLE } from '../../constants/entityTypes';
import { deleteModel } from '../../utils/sharedActions';
import /*showDialog, hideDialog*/ '../../actions';

export const isRoleContextActionAllowed = () => true;

export const roleContextMenuIcons = {
    show_details: 'info',
    sharing_settings: 'share',
    edit: 'edit',
    remove: 'delete',
};

export const roleContextMenuActions = Action.createActionsFromNames([
    'show_details',
    'sharing_settings',
    'edit',
    'remove',
]);

roleContextMenuActions.show_details.subscribe(({ data: { id } }) => {
    // navigateTo(`/users/view/${id}`);
    console.log('show_details for user with id: ', id);
});

roleContextMenuActions.sharing_settings.subscribe(action => {
    console.log('sharing_settings: ', action);
});

roleContextMenuActions.edit.subscribe(({ data: { id } }) => {
    console.log('edit user with id ' + id);
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
