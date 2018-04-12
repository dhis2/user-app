import {
    SHOW_SHARING_DIALOG,
    HIDE_SHARING_DIALOG,
} from '../../constants/actionTypes';
import { INITIAL_SHARING_STATE } from '../../constants/defaults';

const sharingReducer = (state = INITIAL_SHARING_STATE, { type, payload }) => {
    switch (type) {
        case SHOW_SHARING_DIALOG:
            return {
                show: true,
                ...payload,
            };
        case HIDE_SHARING_DIALOG:
            return { ...INITIAL_SHARING_STATE };
        default:
            return state;
    }
};

export default sharingReducer;
