import { PAGER as DEFAULT_PAGER } from '../constants/defaults';
import {
    USER_LIST_RECEIVED,
    USER_ROLE_LIST_RECEIVED,
    USER_GROUP_LIST_RECEIVED,
    PAGE_INCREMENTED,
    PAGE_DECREMENTED,
    PAGER_RESET,
} from '../constants/actionTypes';

const pagerReducer = (state = DEFAULT_PAGER, { type, payload }) => {
    switch (type) {
        case PAGER_RESET:
            return { ...DEFAULT_PAGER };
        case USER_LIST_RECEIVED:
        case USER_ROLE_LIST_RECEIVED:
        case USER_GROUP_LIST_RECEIVED:
            return parsePager(payload.pager);
        case PAGE_INCREMENTED:
            return {
                ...state,
                page: state.page + 1,
            };
        case PAGE_DECREMENTED:
            return {
                ...state,
                page: state.page - 1,
            };
        default:
            return state;
    }
};

const parsePager = pager => {
    delete pager.nextPage;
    const { total, pageCount, page, pageSize } = pager;
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize);
    const startItem = 1 + pageCalculationValue - pageSize;
    const endItem = pageCalculationValue;
    pager.currentlyShown = `${startItem} - ${endItem > total ? total : endItem}`;
    return pager;
};

export default pagerReducer;
