import { FILTER_UPDATED, FILTER_RESET } from '../constants/actionTypes';
import { LIST_FILTER as DEFAULT_FILTER } from '../constants/defaults';

const filterReducer = (state = DEFAULT_FILTER, { type, payload }) => {
    switch (type) {
        case FILTER_UPDATED:
            const { updateKey, updateValue } = payload;
            return {
                ...state,
                [updateKey]: updateValue,
            };
        case FILTER_RESET:
            return { ...DEFAULT_FILTER };
        default:
            return state;
    }
};

export default filterReducer;
