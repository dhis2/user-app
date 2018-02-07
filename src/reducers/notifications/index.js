import { combineReducers } from 'redux';
import snackbarReducer from './snackbar';
import dialogReducer from './dialog';

const notificationsReducer = combineReducers({
    snackbar: snackbarReducer,
    dialog: dialogReducer,
});

export default notificationsReducer;
