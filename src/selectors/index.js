import _ from '../constants/lodash';
import { USER_PROPS, USER_CRED_PROPS } from '../components/users/UserForm/config';
import { asArray, getNestedProp } from '../utils';

export const pagerSelector = _.memoize(pager => {
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
});

export const listSelector = _.memoize((list, itemMemberships) => {
    if (!list || typeof list === 'string') {
        return list;
    }

    const listType = list.modelDefinition.name;
    return list.toArray().map(item => listMappings[listType](item, itemMemberships));
});

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

export const orgUnitsAsStringSelector = _.memoize(orgUnits => {
    return orgUnits.map(unit => unit.displayName).join(', ');
});

export const initialSharingSettingsSelector = _.memoize(
    ({ publicAccess, userGroupAccesses }) => {
        return userGroupAccesses.reduce(
            (initialValues, accessGroup) => {
                initialValues[`group_${accessGroup.id}`] = accessGroup.access;
                return initialValues;
            },
            { publicAccess }
        );
    }
);

export const userFormInitialValuesSelector = _.memoize(user => {
    if (!user.id) {
        return null;
    }

    let initialValues = {};

    USER_PROPS.forEach(propName => {
        initialValues[propName] = user[propName];
    });

    USER_CRED_PROPS.forEach(propName => {
        initialValues[propName] = user.userCredentials[propName];
    });

    return initialValues;
});

export const analyticsDimensionsRestrictionsSelector = _.memoize(user => {
    const catConstraints = asArray(
        getNestedProp('userCredentials.catDimensionConstraints', user)
    );
    const cogsConstraints = asArray(
        getNestedProp('userCredentials.cogsDimensionConstraints', user)
    );
    return [...catConstraints, ...cogsConstraints];
});
