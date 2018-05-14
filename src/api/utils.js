/**
 * This module includes helper functions used by the API class
 * @module Api/utils
 */

import { generateUid } from 'd2/lib/uid';
import _ from '../constants/lodash';
import store from '../store';
import {
    PAGE as DEFAULT_PAGE,
    PAGE_SIZE as DEFAULT_PAGE_SIZE,
} from '../constants/defaults';

import FIELDS from '../constants/queryFields';

import {
    USER_PROPS,
    USER_CRED_PROPS,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    PASSWORD,
    REPEAT_PASSWORD,
    EXTERNAL_AUTH,
} from '../containers/UserForm/config';

/**
 * Helper function that produces a "fields" array used in the api request payload
 * @param {String} entityName - "user" "userRole" or "userGroup"
 * @param {Boolean} detailFields - Should be true if caller want to get field
 * @return {Array} An array of fields/properties that should be included in the api response
 * @function
 */
export const getQueryFields = (entityName, detailFields) => {
    const formattedEntityName = _.snakeCase(entityName).toUpperCase();
    const varName = detailFields
        ? `${formattedEntityName}_DETAILS`
        : `${formattedEntityName}_LIST`;

    return FIELDS[varName];
};

/**
 * Helper function that prepares the request payload for a getList api call.
 * Combines the
 * @param {Number} page - The page number that should be requested
 * @param {Object} filter - Parameters to filter the result set with on the server
 * @param {Array} fields - Properties that should be returned for each object
 * @returns {Object} A valid request payload for api list calls
 * @function
 */
export const createListRequestData = (page = DEFAULT_PAGE, filter, fields) => {
    const {
        query,
        inactiveMonths,
        selfRegistered,
        invitationStatus,
        organisationUnits,
    } = filter;

    let requestData = {
        pageSize: DEFAULT_PAGE_SIZE,
        fields,
        page,
    };

    if (query) requestData.query = query;
    if (inactiveMonths) requestData.inactiveMonths = inactiveMonths;
    if (selfRegistered) requestData.selfRegistered = selfRegistered;
    if (invitationStatus) requestData.invitationStatus = invitationStatus;

    if (organisationUnits.length) {
        const ids = organisationUnits.map(unit => unit.id).join();
        requestData.filter = `organisationUnits.id:in:[${ids}]`;
    }

    return requestData;
};

const addValueAsProp = (data, value, propName) => {
    if (!_.isUndefined(value)) {
        data[propName] = _.isArray(value) ? value.map(id => ({ id })) : value;
    }
};

/**
 * This function prepares a the payload object used for saving a user
 * @param {Object} values - Key-value with form values produced by redux-form
 * @param {Object} user - D2 user model instance
 * @returns {Object}  Object that may be PUT/POSTed to the server to save a user
 * @function
 */
export const parseUserSaveData = (values, user, inviteUser) => {
    const userId = user.id || generateUid();
    const userCredId = (user.userCredentials && user.userCredentials.id) || generateUid();
    let data = {
        id: userId,
        userCredentials: {
            id: userCredId,
            userInfo: { id: userId },
            cogsDimensionConstraints: [],
            catDimensionConstraints: [],
        },
    };
    let cred = data.userCredentials;

    // catCogsDimensionConstraints are combined into a single input component,
    // but need to be stored separately
    if (_.isArray(values.catCogsDimensionConstraints)) {
        values.catCogsDimensionConstraints.forEach(constraint => {
            if (constraint.dimensionType === 'CATEGORY_OPTION_GROUP_SET') {
                cred.cogsDimensionConstraints.push({ id: constraint.id });
            } else {
                cred.catDimensionConstraints.push({ id: constraint.id });
            }
        });
    }

    USER_PROPS.forEach(propName => addValueAsProp(data, values[propName], propName));
    USER_CRED_PROPS.forEach(propName => addValueAsProp(cred, values[propName], propName));

    // This property was appended to the model by hand but needs to be removed before saving the user
    delete cred[DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS];

    if (inviteUser || values[EXTERNAL_AUTH]) {
        delete cred[PASSWORD];
        delete cred[REPEAT_PASSWORD];
    }

    return data;
};

export const parseLocaleUrl = (type, username, val) => {
    return `/userSettings/key${type}Locale?user=${username}&value=${val}`;
};

export const mapLocale = ({ locale, name }) => {
    return {
        id: locale,
        label: name,
    };
};

/**
 * When querying the server for organisation units that match a certain query string, the server returns all units from the system root.
 * However, the current user should only be able to see organisation units that he has access to.
 * @param {Object} orgUnits - A d2 ModelCollection instance of organisation units which has been filtered on the server by a query string
 * @param {*} orgUnitType - The type of organisation unit that should be used to restrict the results by
 * @returns {Array} - An filtered array of d2 models only including organisation units that the current user has access to
 * @function
 */
export const getRestrictedOrgUnits = (orgUnits, orgUnitType) => {
    const { currentUser } = store.getState();
    // Try the requested orgUnitType first and use currentUser.organisationUnits as fallback
    const availableOrgUnits =
        currentUser[orgUnitType].size > 0
            ? currentUser[orgUnitType]
            : currentUser[DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS];

    return orgUnits.toArray().filter(unit => {
        const isAvailableUnit = Boolean(availableOrgUnits.get(unit.id));
        const hasAvailableAncestor =
            !isAvailableUnit &&
            unit.ancestors
                .toArray()
                .some(ancestor => Boolean(availableOrgUnits.get(ancestor.id)));

        return isAvailableUnit || hasAvailableAncestor;
    });
};
