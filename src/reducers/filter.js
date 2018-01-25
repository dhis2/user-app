import {
    FILTER_UPDATED,
    FILTER_RESET,
    FILTER_RESET_FOR_USER,
} from '../constants/actionTypes';
import {
    LIST_FILTER as DEFAULT_FILTER,
    USER_LIST_FILTER as DEFAULT_USER_FILTER,
} from '../constants/defaults';

const filterReducer = (state = DEFAULT_FILTER, { type, payload }) => {
    switch (type) {
        case FILTER_UPDATED:
            const { currentFilter, updateKey, updateValue } = payload;
            return {
                ...currentFilter,
                [updateKey]: updateValue,
            };
        case FILTER_RESET:
            return { ...DEFAULT_FILTER };
        case FILTER_RESET_FOR_USER:
            return { ...DEFAULT_USER_FILTER };
        default:
            return state;
    }
};

export default filterReducer;
