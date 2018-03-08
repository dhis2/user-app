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

export const listSelector = (list, itemMemberships) => {
    if (!list || typeof list === 'string') {
        return list;
    }

    const listType = list.modelDefinition.name;
    return list.toArray().map(item => listMappings[listType](item, itemMemberships));
};

const listMappings = {
    user: item => {
        item.userName = item.userCredentials.username;
        return item;
    },
    userRole: item => item,
    userGroup: (item, itemMemberships) => {
        item.currentUserIsMember = itemMemberships.some(({ id }) => id === item.id)
            ? '\u2713'
            : '';
        return item;
    },
};

export const orgUnitsAsStringSelector = orgUnits => {
    return orgUnits.map(unit => unit.displayName).join(', ');
};

export const initialSharingSettingsSelector = ({ publicAccess, userGroupAccesses }) => {
    return userGroupAccesses.reduce(
        (initialValues, accessGroup) => {
            initialValues[`group_${accessGroup.id}`] = accessGroup.access;
            return initialValues;
        },
        { publicAccess }
    );
};
