export const pagerSelector = pager => {
    if (pager === null) {
        return pager;
    }
    const { total, pageCount, page, query: { pageSize } } = pager;
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize);
    const startItem = 1 + pageCalculationValue - pageSize;
    const endItem = pageCalculationValue;

    pager.currentlyShown = `${startItem} - ${endItem > total ? total : endItem}`;
    return pager;
};

export const listSelector = list => {
    if (!list || typeof list === 'string') {
        return list;
    }

    const listType = list.modelDefinition.name;
    return list.toArray().map(mappings[listType]);
};

const mappings = {
    user: item => {
        item.userName = item.userCredentials.username;
        return item;
    },
    userRole: item => item,
    userGroup: item => item,
};
