/**
 * Defines the RoleList context menu for current user on a given UserRole model instance.
 * Contains definitions for menu item visibility, individual menu item actions, icons and names.
 * @module containers/RoleList/RoleContextMenuActions
 */
import { Action } from '@dhis2/d2-ui-core'
import { USER_ROLE } from '../../constants/entityTypes'
import navigateTo from '../../utils/navigateTo'
import { deleteModel, openSharingSettings } from '../../utils/sharedActions'

const show_details = 'show_details'
const sharing_settings = 'sharing_settings'
const edit = 'edit'
const remove = 'remove'

/**
 * Determines whether a specific user role action should be visible for current user and given UserRole instance
 * @param {Object} model - d2 UserRole model instance
 * @param {String} action - Action name
 * @returns {Boolean} - Action visibility
 * @function
 */
export const isRoleContextActionAllowed = (model, action) => {
    if (!model) {
        return false
    }

    const { access } = model

    switch (action) {
        case show_details:
            return access.read
        case sharing_settings:
            return access.manage
        case edit:
            return access.update
        case remove:
            return access.delete
        default:
            return true
    }
}

export const roleContextMenuIcons = {
    [show_details]: 'info',
    [sharing_settings]: 'share',
    [edit]: 'edit',
    [remove]: 'delete',
}

export const roleContextMenuActions = Action.createActionsFromNames([
    [show_details],
    [sharing_settings],
    [edit],
    [remove],
])

roleContextMenuActions.show_details.subscribe(({ data: { id } }) => {
    navigateTo(`/user-roles/view/${id}`)
})

roleContextMenuActions.sharing_settings.subscribe(openSharingSettings)

roleContextMenuActions.edit.subscribe(({ data: { id } }) => {
    navigateTo(`/user-roles/edit/${id}`)
})

roleContextMenuActions.remove.subscribe(({ data: role }) => {
    const params = {
        model: role,
        entityType: USER_ROLE,
    }
    deleteModel(params)
})
