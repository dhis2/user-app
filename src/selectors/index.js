/**
 * A collection of selector functions that return derived state slices. Results are memoized where possible.
 * @module selectors
 */
import _ from '../constants/lodash';
import i18n from '@dhis2/d2-i18n';
import {
    USER_PROPS,
    USER_CRED_PROPS,
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
} from '../containers/UserForm/config';
import asArray from '../utils/asArray';
import getNestedProp from '../utils/getNestedProp';

/**
 * @param {Object} pager - A d2 Pager instance
 * @returns {Object} The d2 Pager instance with an appended 'currentlyShown' property
 * @function
 */
export const pagerSelector = _.memoize(pager => {
    if (pager === null) {
        return pager;
    }
    const {
        total,
        pageCount,
        page,
        query: { pageSize },
    } = pager;
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize);
    const startItem = 1 + pageCalculationValue - pageSize;
    const endItem = pageCalculationValue;

    pager.currentlyShown = `${startItem} - ${endItem > total ? total : endItem}`;
    return pager;
});

/**
 * @param {Object} list - A d2 list ModelCollection instance
 * @param {Object} [groupMemberships] - An array of groupMembership IDs (userGroup only)
 * @returns {Array} An array of d2 model instances with properties appended for use in the List component
 * @function
 */
export const listSelector = (list, groupMemberships) => {
    if (!list || typeof list === 'string') {
        return list;
    }

    const listType = list.modelDefinition.name;
    return list.toArray().map(item => listMappings[listType](item, groupMemberships));
};

const listMappings = {
    user: item => {
        item.userName = item.userCredentials.username;
        item.disabled = item.userCredentials.disabled;
        return item;
    },
    userRole: item => item,
    userGroup: (item, groupMemberships) => {
        item.currentUserIsMember = groupMemberships.some(({ id }) => id === item.id);
        return item;
    },
};

/**
 * @param {Object} orgUnits - an array of d2 organisation unit instances
 * @returns {String} Either a comma delimited list of organisation unit names, or a count of selected organisation units phrase
 * @function
 */
export const orgUnitsAsStringSelector = _.memoize(orgUnits => {
    return orgUnits.length < 3
        ? orgUnits.map(unit => unit.displayName).join(', ')
        : i18n.t('{{count}} selected', { count: orgUnits.length });
});

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

/**
 * Produces initial values for REDUX form
 * @param {Object} user - A d2 user model instance (state.currentItem)
 * @param {Object} locales - Contains available and selected locales for the UI and DB
 * @returns {Object} Initial values for the REDUX form wrapping the UserForm component
 * @function
 */
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

/**
 * Used to combine cat and cog dimension restrictions into a single array
 * @param {Object} user - A d2 user model instance (state.currentItem)
 * @returns {Object} An array of cat and cog IDs
 * @function
 */
export const analyticsDimensionsRestrictionsSelector = _.memoize(user => {
    const catConstraints = asArray(
        getNestedProp('userCredentials.catDimensionConstraints', user)
    );
    const cogsConstraints = asArray(
        getNestedProp('userCredentials.cogsDimensionConstraints', user)
    );
    return [...catConstraints, ...cogsConstraints];
});

/**
 * A short item is a basic version of state.currentItem, derived from a list.
 * It is used to display basic information in a FormLoader or DetailSummary component
 * while the full version of the currentItem is being fetched.
 * @param {String} id - The id of the model selected in a list
 * @param {Object} list - A d2  model collection instance instance (state.list)
 * @returns {Object} A d2 model instance containing only a few basic properties
 * @function
 */
export const shortItemSelector = _.memoize((id, list) => {
    if (!list || !id) {
        return null;
    }
    return list.get(id);
});

/**
 * Organisation unit trees should have different roots depending on the context.
 * @param {String} orgUnitType - The type orgUnits to return
 * @param {Object} currentUser - state.currentUser
 * @returns {Array|null} The roots of the organisation unit tree to be displayed
 * @function
 */
export const orgUnitRootsSelector = (orgUnitType, currentUser) => {
    const fallBackOrgUnitRoots = currentUser[DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS];

    if (!fallBackOrgUnitRoots) {
        return null;
    }

    const orgUnitRootsForType = currentUser[orgUnitType].toArray();
    if (orgUnitRootsForType.length === 0) {
        return fallBackOrgUnitRoots.toArray();
    } else {
        return orgUnitRootsForType;
    }
};
