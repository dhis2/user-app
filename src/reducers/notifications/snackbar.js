import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../../constants/actionTypes';
import { INITIAL_SNACKBAR_STATE } from '../../constants/defaults';

const snackbarReducer = (state = INITIAL_SNACKBAR_STATE, { type, payload }) => {
    switch (type) {
        case SHOW_SNACKBAR:
            return {
                show: true,
                props: payload,
            };
        case HIDE_SNACKBAR:
            return { ...INITIAL_SNACKBAR_STATE };
        default:
            return state;
    }
};

export default snackbarReducer;
