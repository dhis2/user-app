import { PAGER as DEFAULT_PAGER } from '../constants/defaults';
import { LIST_RECEIVED, PAGER_RESET } from '../constants/actionTypes';

const pagerReducer = (state = DEFAULT_PAGER, { type, payload }) => {
    switch (type) {
        case PAGER_RESET:
            return { ...DEFAULT_PAGER };
        case LIST_RECEIVED:
            return parsePager(payload.pager);
        default:
            return state;
    }
};

const parsePager = pager => {
    const { total, pageCount, page, query: { pageSize } } = pager;
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize);
    const startItem = 1 + pageCalculationValue - pageSize;
    const endItem = pageCalculationValue;
    pager.currentlyShown = `${startItem} - ${endItem > total ? total : endItem}`;
    return pager;
};

export default pagerReducer;
