import { SHOW_DIALOG, HIDE_DIALOG } from '../../constants/actionTypes';
import { INITIAL_DIALOG_STATE } from '../../constants/defaults';

const dialogReducer = (state = INITIAL_DIALOG_STATE, { type, payload }) => {
    switch (type) {
        case SHOW_DIALOG:
            return {
                show: true,
                ...payload,
            };
        case HIDE_DIALOG:
            return { ...INITIAL_DIALOG_STATE };
        default:
            return state;
    }
};

export default dialogReducer;
