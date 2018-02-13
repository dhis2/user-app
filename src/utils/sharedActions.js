import store from '../store';
import { getList, showSnackbar, hideSnackbar } from '../actions';
import i18next from 'i18next';

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
