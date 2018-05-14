import store from '../store';
import api from '../api';
import { refreshCurrentUser as refresh } from '../actions';
import { USER, USER_ROLE, USER_GROUP } from '../constants/entityTypes';

/**
 * This function can be called after users/ userRoles/ urserGroups have been updated or deleted.
 * It will determine if these changes impact the current user.
 * If so, an action is dispatched that will trigger the currentUser state to be refreshed.
 * Or, in case a currentUser was disabled or removed it will trigger a page refresh
 * Currently this function is used by:
 * - `UserForm.saveGroup`
 * - `GroupForm.saveGroup`
 * - `RoleForm.saveRole`
 * - `onRemoveConfirm` in `sharedActions`
 * - `updateDisabledState` in `UserContextMenuActions`
 *
 * @param {String} entityType - The type of object that was changed
 * @param {Object} model - A d2 model or POJO that provides at least the ID of the entity that was changed
 * @param {String} [changeType] - The type of change that happened
 * @memberof module:utils
 * @function
 */
const detectCurrentUserChanges = (model, disable) => {
    const { currentUser } = store.getState();
    const entityType = model.modelDefinition.name;
    console.log('detecting...', model, entityType);

    if (entityType === USER && model.id === currentUser.id) {
        disable ? logout() : refreshCurrentUser();
    }

    if (entityType === USER_ROLE && currentUser.userRoles.get(model.id)) {
        refreshCurrentUser();
    }

    if (entityType === USER_GROUP && currentUser.userGroups.get(model.id)) {
        refreshCurrentUser();
    }
};

const refreshCurrentUser = () => {
    store.dispatch(refresh());
};

const logout = () => {
    const contextPath = api.getContextPath();
    const logoutSuffix = '/dhis-web-commons-security/logout.action';
    const logoutUrl = contextPath + logoutSuffix;
    window.location.assign(logoutUrl);
};

export default detectCurrentUserChanges;
