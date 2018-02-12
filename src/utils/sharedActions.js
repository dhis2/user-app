import store from '../store';
import { showSnackbar, hideSnackbar } from '../actions';
import i18next from 'i18next';

export const removeEntity = ({ confirmMsg, successMsg, errorMsg, entity, getList }) => {
    const snackbarProps = {
        message: confirmMsg,
        action: i18next.t('Confirm'),
        autoHideDuration: null,
        onActionClick: () => onRemoveConfirm(entity, successMsg, errorMsg, getList),
    };
    store.dispatch(showSnackbar(snackbarProps));
};

const onRemoveConfirm = (entity, successMsg, errorMsg, getList) => {
    store.dispatch(hideSnackbar());

    entity
        .delete()
        .then(() => {
            store.dispatch(showSnackbar({ message: successMsg }));
            store.dispatch(getList());
        })
        .catch(() => {
            store.dispatch(showSnackbar({ message: errorMsg }));
        });
};
