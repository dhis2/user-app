import Action from 'd2-ui/lib/action/Action';

const createUserContextActions = parentProps => {
    let userContextMenu = new UserContextMenu(parentProps);
    return {
        actions: userContextMenu.actions,
        icons: userContextMenu.icons,
        isActionAllowed: userContextMenu.isActionAllowed,
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
            'assignSearchOrgUnits',
            'remove',
            'replicate',
            'resendInvitation',
            // 'showDetails',
            'disable',
            'enable',
        ]);
        Object.keys(this.actions).forEach(actionName => {
            this.actions[actionName].subscribe(
                this[`${actionName}ActionHandler`].bind(this)
            );
        });
    }

    setIcons() {
        this.icons = {
            profile: 'account_circle',
            edit: 'edit',
            assignSearchOrgUnits: 'account_balance',
            remove: 'delete',
            replicate: 'content_copy',
            resendInvitation: 'send',
            // showDetails: 'show_details',
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
        console.log('remove: ', action);
    }

    replicateActionHandler(action) {
        console.log('replicate: ', action);
    }

    resendInvitationActionHandler(action) {
        console.log('resendInvitation: ', action);
    }

    disableActionHandler(action) {
        console.log('disable: ', action);
    }

    enableActionHandler(action) {
        console.log('enable: ', action);
    }
}

export default createUserContextActions;
