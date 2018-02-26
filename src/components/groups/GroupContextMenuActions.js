import i18next from 'i18next';
import Action from 'd2-ui/lib/action/Action';
// import { navigateTo } from '../../utils';
// import store from '../../store';
import { deleteModel, openSharingSettings } from '../../utils/sharedActions';
import { USER_GROUP } from '../../constants/entityTypes';
import /*showDialog, hideDialog */ '../../actions';

export const isGroupContextActionAllowed = () => true;

export const groupContextMenuIcons = {
    show_details: 'info',
    sharing_settings: 'share',
    edit: 'edit',
    leave_group: 'exit_to_app',
    remove: 'delete',
};

export const groupContextMenuActions = Action.createActionsFromNames([
    'show_details',
    'sharing_settings',
    'edit',
    'leave_group',
    'remove',
]);

groupContextMenuActions.show_details.subscribe(({ data: { id } }) => {
    // navigateTo(`/users/view/${id}`);
    console.log('show_details for user with id: ', id);
});

groupContextMenuActions.sharing_settings.subscribe(openSharingSettings);

groupContextMenuActions.edit.subscribe(({ data: { id } }) => {
    console.log('edit user with id ' + id);
});

groupContextMenuActions.leave_group.subscribe(action => {
    console.log('leave_group: ', action);
});

groupContextMenuActions.remove.subscribe(({ data: group }) => {
    const params = {
        confirmMsg: i18next.t('Are you sure you want to remove this user group?'),
        successMsg: i18next.t('User group removed succesfully'),
        errorMsg: i18next.t('There was a problem deleting the user group'),
        model: group,
        entityType: USER_GROUP,
    };
    deleteModel(params);
});
