import { LIST_RECEIVED, PAGER_RESET } from '../constants/actionTypes';

const pagerReducer = (state = null, { type, payload }) => {
    switch (type) {
        case PAGER_RESET:
            return null;
        case LIST_RECEIVED:
            return payload.response.pager;
        default:
            return state;
    }
};

export default pagerReducer;
