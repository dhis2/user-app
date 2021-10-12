/* eslint-disable max-params */

import i18n from '@dhis2/d2-i18n'
import {
    getList,
    showSnackbar,
    hideSnackbar,
    showSharingDialog,
} from '../actions'
import store from '../store'
import createHumanErrorMessage from './createHumanErrorMessage'
import detectCurrentUserChanges from './detectCurrentUserChanges'

export const deleteModel = ({ model, entityType }) => {
    const interpolator = {
        type: model.modelDefinition.displayName,
        displayName: model.displayName,
    }
    const confirmMsg = i18n.t(
        'Are you sure you want to remove the {{type}} "{{displayName}}"?',
        interpolator
    )
    const successMsg = i18n.t(
        '{{type}} "{{displayName}}" removed successfully',
        interpolator
    )
    const errorMsg = i18n.t(
        'There was a problem removing {{type}} "{{displayName}}"?',
        interpolator
    )
    const snackbarProps = {
        message: confirmMsg,
        action: i18n.t('Confirm'),
        autoHideDuration: null,
        onActionClick: () =>
            onRemoveConfirm(model, successMsg, errorMsg, entityType),
    }

    store.dispatch(showSnackbar(snackbarProps))
}

const onRemoveConfirm = async (model, successMsg, errorMsg, entityType) => {
    store.dispatch(hideSnackbar())

    try {
        await model.delete()
        store.dispatch(showSnackbar({ message: successMsg }))
        store.dispatch(getList(entityType))
        detectCurrentUserChanges(model)
    } catch (error) {
        const msg = createHumanErrorMessage(error, errorMsg)
        store.dispatch(showSnackbar({ message: msg }))
    }
}

export const openSharingSettings = ({ data: model }) => {
    store.dispatch(showSharingDialog(model.id, model.modelDefinition.name))
}
