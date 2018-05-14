import { getInstance } from 'd2/lib/d2';
import i18n from '@dhis2/d2-i18n';
import {
    getQueryFields,
    createListRequestData,
    parseUserSaveData,
    parseLocaleUrl,
    getRestrictedOrgUnits,
    mapLocale,
} from './utils';

import groupAuthorities from '../components/AuthorityEditor/utils/groupAuthorities';

import {
    ORG_UNITS_QUERY_CONFIG,
    CURRENT_USER_ORG_UNITS_FIELDS,
} from '../constants/queryFields';

import {
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
    USE_DB_LOCALE,
} from '../containers/UserForm/config';

/**
 * The Api class exposes all necessary functions to get the required data from the DHIS2 web api.
 */
class Api {
    /**
     * On instantiation d2 and the d2-api instance are attached to the this scope, so they are easily accessible by its members.
     * @constructor
     */
    constructor() {
        getInstance().then(d2 => {
            this.d2 = d2;
            this.d2Api = d2.Api.getApi();
            // In development you can access d2 and d2Api via the console
            if (process.env.NODE_ENV === 'development') {
                window.d2 = this.d2;
                window.d2Api = this.d2Api;
            }
        });
    }

    /**************************
     ********* GENERIC ********
     **************************/

    getD2 = () => {
        return this.d2;
    };

    getContextPath = () => {
        return this.d2.system.systemInfo.contextPath;
    };

    getModelDefinition = name => {
        return this.d2.models[name];
    };

    getList = (entityName, page, filter) => {
        const fields = getQueryFields(entityName);
        const requestData = createListRequestData(page, filter, fields);
        return this.d2.models[entityName].list(requestData);
    };

    getItem = (entityName, id) => {
        const data = { fields: getQueryFields(entityName, true) };
        return this.d2.models[entityName].get(id, data);
    };

    genericFind = (entityName, propertyName, value) => {
        return this.d2.models[entityName]
            .filter()
            .on(propertyName)
            .equals(value)
            .list({ fields: ['id'] });
    };

    /**************************
     ********* USERS **********
     **************************/

    replicateUser = (id, username, password) => {
        const url = `/users/${id}/replica`;
        const data = { username, password };
        return this.d2Api.post(url, data);
    };

    /**
     * Fetches organisation units matching the query string from the server.
     * Once the results are returned they are filtered client-side
     * to only contain organisation units available to the current user.
     * Used by SearchableOrgUnitTree in UserForm and UserList.
     * @param {String} query - They search string to let the server query on
     * @param {String} orgUnitType - The type of organisation unit to use for client side filtering
     * @returns {Array} A filtered array of organisation units
     */
    queryOrgUnits = (query, orgUnitType) => {
        const listConfig = {
            ...ORG_UNITS_QUERY_CONFIG,
            query,
        };
        return this.d2.models.organisationUnits
            .list(listConfig)
            .then(orgUnits => getRestrictedOrgUnits(orgUnits, orgUnitType));
    };

    getAvailableUserRoles = () => {
        const data = { canIssue: true, fields: ['id', 'displayName'] };
        return this.d2.models.userRoles.list(data);
    };

    getAvailableDataAnalyticsDimensionRestrictions = () => {
        const url = '/dimensions/constraints';
        const data = { fields: ['id', 'name', 'dimensionType'] };
        return this.d2Api.get(url, data).then(({ dimensions }) => dimensions);
    };

    updateDisabledState = (id, disabled) => {
        const url = `/users/${id}`;
        const data = { userCredentials: { disabled: disabled } };
        return this.d2Api.patch(url, data);
    };

    getSelectedAndAvailableLocales = username => {
        username = username ? encodeURIComponent(username) : null;

        const useDbLocaleOption = {
            id: USE_DB_LOCALE,
            label: i18n.t('Use database locale / no translation'),
        };

        const dbLocales = this.d2Api.get('/locales/db');
        const uiLocales = this.d2Api.get('/locales/ui');

        const uiLocale = username
            ? this.d2Api.get(`/userSettings/keyUiLocale?user=${username}`)
            : this.d2.system.settings.get('keyUiLocale');

        const dbLocale = username
            ? this.d2Api.get(`/userSettings/keyDbLocale?user=${username}`)
            : Promise.resolve(USE_DB_LOCALE);

        return Promise.all([dbLocales, uiLocales, dbLocale, uiLocale]).then(
            ([dbLocales, uiLocales, dbLocale, uiLocale]) => ({
                db: {
                    available: [useDbLocaleOption, ...dbLocales.map(mapLocale)],
                    selected: dbLocale || USE_DB_LOCALE,
                },
                ui: {
                    available: uiLocales.map(mapLocale),
                    selected: uiLocale,
                },
            })
        );
    };

    /**
     * Will first execute a create/update user request, and if any locale values have been set will add subsequent request to update these too.
     * @param {Object} values - Form data produced by redux-form
     * @param {Object} user - A d2 user model instance
     * @param {String} initialUiLocale - Locale string for the UI, i.e. 'en'
     * @param {String} initialDbLocale - Locale string for the DB, i.e. 'fr'
     * @returns {Promise} Promise object for the combined ajax calls to save a user
     * @method
     */
    saveOrInviteUser = (values, user, inviteUser, initialUiLocale, initialDbLocale) => {
        const userData = parseUserSaveData(values, user, inviteUser);
        const postUrl = inviteUser ? '/users/invite' : '/users';
        const saveUserPromise = user.id
            ? this.d2Api.update(`/users/${user.id}`, userData)
            : this.d2Api.post(postUrl, userData);

        return saveUserPromise.then(() => {
            const localePromises = [];
            const username = encodeURIComponent(values.username);

            // Add follow-up request for setting uiLocale if needed
            const uiLocale = values[INTERFACE_LANGUAGE];
            if (uiLocale !== initialUiLocale) {
                localePromises.push(
                    this.d2Api.post(parseLocaleUrl('Ui', username, uiLocale))
                );
            }

            // Add follow-up request for setting dbLocale if needed
            const dbLocale = values[DATABASE_LANGUAGE];
            if (dbLocale !== initialDbLocale) {
                const dbLocalePromise =
                    dbLocale === USE_DB_LOCALE
                        ? this.d2Api.delete(`/userSettings/keyDbLocale?user=${username}`)
                        : this.d2Api.post(parseLocaleUrl('Db', username, dbLocale));
                localePromises.push(dbLocalePromise);
            }

            // Dummy follow-up request to prevent Promise.all error
            // if neither locale fields need updating
            if (localePromises.length === 0) {
                localePromises.push(Promise.resolve('No locale changes detected'));
            }
            // Updating locales after user in case the user is new
            return Promise.all(localePromises);
        });
    };

    /**************************
     ***** USER GROUPS ********
     **************************/

    getManagedUsers = () => {
        const data = { fields: ['id', 'displayName'] };
        return this.d2.models.user.list(data);
    };

    // Also used by GroupForm
    getAvailableUserGroups = () => {
        const data = { fields: ['id', 'displayName'] };
        return this.d2.models.userGroups.list(data);
    };

    /**************************
     ****** USER ROLES ********
     **************************/

    // TODO: A proper API endpoint will be made available for this call once ALL struts apps
    // have been ported to React. Once this is done we need to update this method.
    getGroupedAuthorities = () => {
        if (this.groupedAuths) {
            // Return cached version if available
            return Promise.resolve(this.groupedAuths);
        }
        const url = `${this.getContextPath()}/dhis-web-commons/security/getSystemAuthorities.action`;
        return this.d2Api.request('GET', url).then(({ systemAuthorities }) => {
            // Store on instance for subsequent requests
            return (this.groupedAuths = groupAuthorities(systemAuthorities));
        });
    };

    /**************************
     ****** CURRENT USER ******
     **************************/

    getCurrentUser = () => {
        return this.d2.currentUser;
    };

    initCurrentUser = () => {
        return Promise.all([
            this.d2.currentUser.getUserGroups(),
            this.d2.currentUser.getUserRoles(),
            this.getCurrentUserOrgUnits(),
        ]).then(
            ([
                userGroups,
                userRoles,
                {
                    organisationUnits,
                    dataViewOrganisationUnits,
                    teiSearchOrganisationUnits,
                },
            ]) => {
                return Object.assign(this.d2.currentUser, {
                    userGroups,
                    userRoles,
                    organisationUnits,
                    dataViewOrganisationUnits,
                    teiSearchOrganisationUnits,
                });
            }
        );
    };

    refreshCurrentUser = () => {
        const CurrentUserClass = Object.getPrototypeOf(this.d2.currentUser).constructor;
        const meFields = [
            ':all',
            'organisationUnits[id]',
            'userGroups[id]',
            'userCredentials[:all,!user,userRoles[id]',
        ];
        const models = this.d2.models;
        const userSettings = this.d2.currentUser.userSettings;

        return Promise.all([
            this.d2Api.get('me', { fields: meFields }),
            this.d2Api.get('me/authorization'),
        ]).then(([me, authorities]) => {
            this.d2.currentUser = CurrentUserClass.create(
                me,
                authorities,
                models,
                userSettings
            );
            return this.initCurrentUser();
        });
    };

    getCurrentUserOrgUnits = () => {
        return this.d2.models.users.get(
            this.d2.currentUser.id,
            CURRENT_USER_ORG_UNITS_FIELDS
        );
    };

    updateCurrentUserGroupMembership = (groupId, deleteMembership) => {
        const method = deleteMembership ? 'delete' : 'post';
        const url = `/users/${this.d2.currentUser.id}/userGroups/${groupId}`;
        return this.d2Api[method](url);
    };
}
const api = new Api();
export default api;
