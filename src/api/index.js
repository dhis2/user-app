import { getInstance } from 'd2/lib/d2';
import {
    getQueryFields,
    createRequestData,
    parseUserSaveData,
    parseLocaleUrl,
} from './helpers';

import {
    ORG_UNITS_QUERY_CONFIG,
    USER_GROUP_QUERY_CONFIG,
} from '../constants/queryFields';

import {
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
} from '../components/users/UserForm/config';

class Api {
    constructor() {
        this.bindAllMethodsToThisScope();
        getInstance().then(d2 => {
            this.d2 = d2;
            this.d2Api = d2.Api.getApi();
            // In developement you can access d2 and d2Api via the console
            if (process.env.NODE_ENV === 'development') {
                window.d2 = this.d2;
                window.d2Api = this.d2Api;
            }
        });
    }

    bindAllMethodsToThisScope() {
        const methodNames = Object.getOwnPropertyNames(this.constructor.prototype);
        const skipMethods = ['constructor', 'init', 'bindAllMethodsToThisScope'];
        methodNames.forEach(methodName => {
            if (!skipMethods.includes(methodName)) {
                this[methodName] = this[methodName].bind(this);
            }
        });
    }

    getList(entityName, page, filter) {
        const fields = getQueryFields(entityName);
        const requestData = createRequestData(page, filter, fields);
        return this.d2.models[entityName].list(requestData);
    }

    getItem(entityName, viewType, id) {
        const data = { fields: getQueryFields(entityName, viewType) };
        return this.d2.models[entityName].get(id, data);
    }

    getUserByUsername(username) {
        return this.d2.models.users
            .filter()
            .on('userCredentials.username')
            .equals(username)
            .list({ fields: ['id'] });
    }

    replicateUser(id, username, password) {
        const url = `/users/${id}/replica`;
        const data = { username, password };
        return this.d2Api.post(url, data);
    }

    getOrgUnits() {
        const listConfig = {
            ...ORG_UNITS_QUERY_CONFIG,
            level: 1,
        };
        return this.d2.models.organisationUnits
            .list(listConfig)
            .then(rootLevel => rootLevel.toArray()[0]);
    }

    queryOrgUnits(query) {
        const listConfig = {
            ...ORG_UNITS_QUERY_CONFIG,
            query,
        };
        return this.d2.models.organisationUnits.list(listConfig);
    }

    queryUserGroups(query) {
        const listConfig = {
            ...USER_GROUP_QUERY_CONFIG,
            query,
        };
        return this.d2.models.userGroups.list(listConfig);
    }

    getCurrentUserGroupMemberships() {
        return this.d2Api.get('/me', { fields: ['userGroups[:all]'] });
    }

    updateCurrentUserGroupMembership(groupId, deleteMembership) {
        const method = deleteMembership ? 'delete' : 'post';
        const url = `/users/${this.d2.currentUser.id}/userGroups/${groupId}`;
        return this.d2Api[method](url);
    }

    updateDisabledState(id, disabled) {
        const url = `/users/${id}`;
        const data = { userCredentials: { disabled: disabled } };
        return this.d2Api.patch(url, data);
    }

    getManagedUsers() {
        const data = { fields: ['id', 'displayName'] };
        console.log(this);
        return this.d2.models.user.list(data);
    }

    getAvailableUserGroups() {
        const data = { fields: ['id', 'displayName'] };
        return this.d2.models.userGroups.list(data);
    }

    getAvailableUserRoles() {
        const data = { canIssue: true, fields: ['id', 'displayName'] };
        return this.d2.models.userRoles.list(data);
    }

    getAvailableDataAnalyticsDimensionRestrictions() {
        const url = '/dimensions/constraints';
        const data = { fields: ['id', 'name', 'dimensionType'] };
        return this.d2Api.get(url, data).then(({ dimensions }) => dimensions);
    }

    updateUserGroup(id, data) {
        const url = `/userGroups/${id}`;
        return this.d2Api.patch(url, data);
    }

    // TODO: This needs to be rewritten once the backend issues are solved
    // https://jira.dhis2.org/browse/DHIS2-3169
    // https://jira.dhis2.org/browse/DHIS2-3168
    // https://jira.dhis2.org/browse/DHIS2-3185
    // https://jira.dhis2.org/browse/DHIS2-3181
    getSelectedAndAvailableLocales(username) {
        username = username ? encodeURIComponent(username) : null;
        const DB_LOCALE = 'db_locale';
        const useDbLocaleOption = {
            locale: DB_LOCALE,
            name: 'Use database locale / no translation',
        };

        const dbLocales = this.d2Api.get('/locales/db');
        const uiLocales = this.d2Api.get('/locales/ui');
        const uiLocale = username
            ? this.d2Api.get(`/userSettings/keyUiLocale?user=${username}`)
            : Promise.resolve('en');
        const dbLocale = username
            ? this.d2Api.get(`/userSettings/keyDbLocale?user=${username}`).then(
                  response => response,
                  error => {
                      // Swallow this error and assume the user wants to use the DB locale
                      if (
                          error.message === 'User setting not found for key: keyDbLocale'
                      ) {
                          return DB_LOCALE;
                      } else {
                          throw new Error(error.message);
                      }
                  }
              )
            : Promise.resolve(DB_LOCALE);

        return Promise.all([dbLocales, uiLocales, dbLocale, uiLocale]).then(responses => {
            return {
                db: {
                    available: [useDbLocaleOption, ...responses[0]],
                    selected: responses[2],
                },
                ui: {
                    available: responses[1],
                    selected: responses[3],
                },
            };
        });
    }

    saveUser(values, user, currentUiLocale, currentDbLocale) {
        let saveFunction;
        let localePromises = [];
        const userData = parseUserSaveData(values, user);

        if (user.id) {
            saveFunction = this.d2Api.update(`/users/${user.id}`, userData);
        } else {
            saveFunction = this.d2Api.post('/users', userData);
        }

        if (values[INTERFACE_LANGUAGE] !== currentUiLocale) {
            localePromises.push(
                this.d2Api.post(
                    parseLocaleUrl('Ui', values.username, values[INTERFACE_LANGUAGE])
                )
            );
        }

        if (values[DATABASE_LANGUAGE] !== currentDbLocale) {
            localePromises.push(
                this.d2Api.post(
                    parseLocaleUrl('Db', values.username, values[DATABASE_LANGUAGE])
                )
            );
        }

        if (localePromises.length === 0) {
            localePromises.push(Promise.resolve('Nothing happened'));
        }

        // Updating locales after user in case the use was not available yet
        return saveFunction.then(Promise.all(localePromises));
    }

    getD2() {
        return this.d2;
    }

    getCurrentUser() {
        return this.d2.currentUser;
    }
}
const api = new Api();
export default api;
