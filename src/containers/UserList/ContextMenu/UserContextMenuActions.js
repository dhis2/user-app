/*
import i18n from '@dhis2/d2-i18n'
import { Action } from '@dhis2/d2-ui-core'
import React from 'react'
import {
    showDialog,
    hideDialog,
    showSnackbar,
    resetUserPassword,
    hideSnackbar,
    getList,
} from '../../actions'
import api from '../../api'
import { USER } from '../../constants/entityTypes'
import store from '../../store'
import createHumanErrorMessage from '../../utils/createHumanErrorMessage'
import detectCurrentUserChanges from '../../utils/detectCurrentUserChanges'
import navigateTo from '../../utils/navigateTo'
import { deleteModel } from '../../utils/sharedActions'

const profile = 'profile'
const edit = 'edit'
const remove = 'remove'
const reset_password = 'reset_password'
const disable = 'disable'
const enable = 'enable'
const disable_2fa = 'disable_2fa'

userContextMenuActions.remove.subscribe(({ data: user }) => {
    const params = {
        model: user,
        entityType: USER,
    }
    deleteModel(params)
})

userContextMenuActions.disable.subscribe(({ data }) => {
    updateDisabledState(data, true)
})

userContextMenuActions.enable.subscribe(({ data }) => {
    updateDisabledState(data, false)
})

userContextMenuActions.disable_2fa.subscribe(({ data }) => {
    showDisable2FAConfirmation(data)
})

const showDisable2FAConfirmation = model => {
    const baseMsg = i18n.t(
        'Are you sure you want to disable two factor authentication for'
    )
    const snackbarProps = {
        message: `${baseMsg} ${model.displayName}`,
        action: i18n.t('Confirm'),
        autoHideDuration: null,
        onActionClick: () => onDisable2FAConfirm(model),
    }
    store.dispatch(showSnackbar(snackbarProps))
}

const onDisable2FAConfirm = async model => {
    store.dispatch(hideSnackbar())

    const { displayName, id } = model
    try {
        await api.disable2FA(id)
        const baseMsg = i18n.t(
            'Succesfully disabled two factor authentication for'
        )
        store.dispatch(showSnackbar({ message: `${baseMsg} ${displayName}` }))
        store.dispatch(getList(USER))
    } catch (error) {
        store.dispatch(
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t(
                        'There was a problem updating two factor authentication'
                    )
                ),
            })
        )
    }
}

const updateDisabledState = (model, shouldDisable) => {
    const baseMsg = shouldDisable
        ? i18n.t('Are you sure you want to disable')
        : i18n.t('Are you sure you want to enable')

    const snackbarProps = {
        message: `${baseMsg} ${model.displayName}`,
        action: i18n.t('Confirm'),
        autoHideDuration: null,
        onActionClick: () => onDisableConfirm(model, shouldDisable),
    }
    store.dispatch(showSnackbar(snackbarProps))
}

const onDisableConfirm = async (model, shouldDisable) => {
    store.dispatch(hideSnackbar())

    const { displayName, id } = model
    try {
        await api.updateDisabledState(id, shouldDisable)
        const baseMsg = shouldDisable
            ? i18n.t('sucessfully disabled')
            : i18n.t('successfully enabled')
        store.dispatch(showSnackbar({ message: `${displayName} ${baseMsg}` }))
        store.dispatch(getList(USER))

        if (shouldDisable) {
            detectCurrentUserChanges(model, true)
        }
    } catch (error) {
        store.dispatch(
            showSnackbar({
                message: createHumanErrorMessage(
                    error,
                    i18n.t('There was a problem updating the enabled state')
                ),
            })
        )
    }
}
*/
