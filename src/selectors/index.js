import _ from '../constants/lodash';
import i18next from 'i18next';
import {
    USER_PROPS,
    USER_CRED_PROPS,
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
} from '../containers/UserForm/config';
import asArray from '../utils/asArray';
import getNestedProp from '../utils/getNestedProp';

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
        item.disabled = item.userCredentials.disabled;
        return item;
    },
    userRole: item => item,
    userGroup: (item, itemMemberships) => {
        item.currentUserIsMember = itemMemberships.some(({ id }) => id === item.id);
        return item;
    },
};

export const orgUnitsAsStringSelector = _.memoize(orgUnits => {
    return orgUnits.length < 3
        ? orgUnits.map(unit => unit.displayName).join(', ')
        : i18next.t('{{count}} selected', { count: orgUnits.length });
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

const addInitialValueFrom = (sourceObject, initialValues, propName) => {
    if (propName === DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS) {
        initialValues[propName] = [
            ...sourceObject.catDimensionConstraints,
            ...sourceObject.cogsDimensionConstraints,
        ];
    } else if (
        (sourceObject[propName] && !_.isUndefined(sourceObject[propName].size)) ||
        _.isArray(sourceObject[propName])
    ) {
        initialValues[propName] = asArray(sourceObject[propName]).map(({ id }) => id);
    } else {
        initialValues[propName] = sourceObject[propName];
    }
};

export const userFormInitialValuesSelector = _.memoize((user, locales) => {
    let initialValues = {};

    if (user.id) {
        USER_PROPS.forEach(propName => {
            addInitialValueFrom(user, initialValues, propName);
        });

        USER_CRED_PROPS.forEach(propName => {
            addInitialValueFrom(user.userCredentials, initialValues, propName);
        });
    }

    initialValues[INTERFACE_LANGUAGE] = locales.ui.selected;
    initialValues[DATABASE_LANGUAGE] = locales.db.selected;

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

export const shortItemSelector = _.memoize((id, list) => {
    if (!list || !id) {
        return null;
    }
    return list.get(id);
});
