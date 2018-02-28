import React from 'react';
import store from '../store';
import { getList, showSnackbar, hideSnackbar, showDialog, hideDialog } from '../actions';
import i18next from 'i18next';
import SharingSettingsForm from '../components/SharingSettingsForm';

export const deleteModel = ({ confirmMsg, successMsg, errorMsg, model, entityType }) => {
    const snackbarProps = {
        message: confirmMsg,
        action: i18next.t('Confirm'),
        autoHideDuration: null,
        onActionClick: () => onRemoveConfirm(model, successMsg, errorMsg, entityType),
    };
    store.dispatch(showSnackbar(snackbarProps));
};

const onRemoveConfirm = (model, successMsg, errorMsg, entityType) => {
    store.dispatch(hideSnackbar());

    model
        .delete()
        .then(() => {
            store.dispatch(showSnackbar({ message: successMsg }));
            store.dispatch(getList(entityType));
        })
        .catch(() => {
            store.dispatch(showSnackbar({ message: errorMsg }));
        });
};

export const openSharingSettings = ({ data: model }) => {
    const content = <SharingSettingsForm model={model} />;
    const props = {
        onRequestClose: () => store.dispatch(hideDialog()),
        title: model.displayName,
        contentStyle: {
            minHeight: '100vh',
        },
    };
    store.dispatch(showDialog(content, props));
};
