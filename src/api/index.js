/* eslint-disable max-params */

import i18n from '@dhis2/d2-i18n'
import groupAuthorities from '../components/AuthorityEditor/utils/groupAuthorities'
import { CURRENT_USER_ORG_UNITS_FIELDS } from '../constants/queryFields'
import {
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
    USE_DB_LOCALE,
} from '../containers/UserForm/config'
import {
    getQueryFields,
    createListRequestData,
    parseUserSaveData,
    parseLocaleUrl,
    mapLocale,
    appendUsernameToDisplayName,
    parse200Error,
    getAttributesWithValueAndId,
} from './utils'

/**
 * The Api class exposes all necessary functions to get the required data from the DHIS2 web api.
 */
class Api {
    /**
     * On instantiation d2 and the d2-api instance are attached to the this scope, so they are easily accessible by its members.
     */

    init(d2) {
        this.d2 = d2
        this.d2Api = d2.Api.getApi()
        // In development you can access d2 and d2Api via the console
        if (process.env.NODE_ENV === 'development') {
            window.d2 = this.d2
            window.d2Api = this.d2Api
        }
    }

    /**************************
     ********* GENERIC ********
     **************************/

    getD2 = () => {
        return this.d2
    }

    getContextPath = () => {
        return this.d2.system.systemInfo.contextPath
    }

    getList = (entityName, page, filter) => {
        const fields = getQueryFields(entityName)
        const requestData = createListRequestData(
            page,
            filter,
            fields,
            entityName,
            this.getCurrentUser()
        )
        return this.d2.models[entityName].list(requestData)
    }

    getItem = (entityName, id) => {
        const data = { fields: getQueryFields(entityName, true) }
        return this.d2.models[entityName].get(id, data)
    }

    genericFind = (entityName, propertyName, value) => {
        return this.d2.models[entityName]
            .filter()
            .on(propertyName)
            .equals(value)
            .list({ fields: ['id'] })
    }

    /**************************
     ********* USERS **********
     **************************/

    replicateUser = (id, username, password) => {
        const url = `/users/${id}/replica`
        const data = { username, password }
        return this.d2Api.post(url, data)
    }

    resetUserPassword = id => {
        const url = `/users/${id}/reset`
        return this.d2Api.post(url)
    }

    updateDisabledState = (id, disabled) => {
        const url = `/users/${id}`
        const data = { userCredentials: { disabled: disabled } }
        return this.d2Api.patch(url, data)
    }

    disable2FA = id => {
        const url = `/users/${id}`
        const data = { userCredentials: { twoFA: false } }
        return this.d2Api.patch(url, data)
    }

    getSelectedAndAvailableLocales = username => {
        const useDbLocaleOption = {
            id: USE_DB_LOCALE,
            label: i18n.t('Use database locale / no translation'),
        }

        const dbLocales = this.d2Api.get('/locales/db')
        const uiLocales = this.d2Api.get('/locales/ui')

        // As of d2 v31.3.0, d2Api handles URI encoding
        const uiLocale = username
            ? this.d2Api.get(`/userSettings/keyUiLocale?user=${username}`)
            : this.d2.system.settings.get('keyUiLocale')

        const dbLocale = username
            ? this.d2Api.get(`/userSettings/keyDbLocale?user=${username}`)
            : Promise.resolve(USE_DB_LOCALE)

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
        )
    }

    getAttributes(entityType) {
        return this.d2Api
            .get('attributes', {
                fields: [
                    'id',
                    'displayName',
                    'mandatory',
                    'unique',
                    'valueType',
                    'optionSet[options[id,displayName]]',
                ],
                filter: `${entityType}Attribute:eq:true`,
                paging: false,
            })
            .then(resp => resp.attributes)
    }

    isAttributeUnique(entityType, modelId, attributeId, value) {
        return (
            this.d2.models[entityType]
                // All users/userGroups but current
                .filter()
                .on('id')
                .notEqual(modelId)
                // Attribute id being validated
                // NB: this only means we are filtering users that have ANY value
                // on the current attributeId
                .filter()
                .on('attributeValues.attribute.id')
                .equals(attributeId)
                // Value on form
                .filter()
                .on('attributeValues.value')
                .equals(value)
                .list({
                    paging: false,
                    fields: ['id', 'attributeValues[value, attribute[id]]'],
                })
                .then(userCollection => {
                    // If no users are found at this point, the attribute value is definitely unique
                    if (userCollection.size === 0) {
                        return true
                    }

                    // If users are returned, this can still include records with the SAME value
                    // on ANOTHER attribute. So we have to filter on the current value and attributeId
                    const attributesWithValueAndId =
                        getAttributesWithValueAndId(
                            userCollection,
                            value,
                            attributeId
                        )

                    return attributesWithValueAndId.length === 0
                })
        )
    }

    /**
     * Will first execute a create/update user request, and if any locale values have been set will add subsequent request to update these too.
     * @param {Object} values - Form data produced by redux-form
     * @param {Object} user - A d2 user model instance
     * @param {String} initialUiLocale - Locale string for the UI, i.e. 'en'
     * @param {String} initialDbLocale - Locale string for the DB, i.e. 'fr'
     * @returns {Promise} Promise object for the combined ajax calls to save a user
     * @method
     */
    saveOrInviteUser = (
        values,
        user,
        inviteUser,
        initialUiLocale,
        initialDbLocale,
        attributeFields
    ) => {
        const userData = parseUserSaveData(
            values,
            user,
            inviteUser,
            attributeFields
        )
        const postUrl = inviteUser ? '/users/invite' : '/users'
        const saveUserPromise = user.id
            ? this.d2Api.update(`/users/${user.id}`, userData)
            : this.d2Api.post(postUrl, userData)

        return saveUserPromise.then(response => {
            if (response.status === 'ERROR') {
                return Promise.reject(parse200Error(response))
            }

            const localePromises = []
            const username = values.username

            // Add follow-up request for setting uiLocale if needed
            const uiLocale = values[INTERFACE_LANGUAGE]
            if (uiLocale !== initialUiLocale) {
                localePromises.push(
                    this.d2Api.post(parseLocaleUrl('Ui', username, uiLocale))
                )
            }

            // Add follow-up request for setting dbLocale if needed
            const dbLocale = values[DATABASE_LANGUAGE]
            if (dbLocale !== initialDbLocale) {
                const dbLocalePromise =
                    dbLocale === USE_DB_LOCALE
                        ? this.d2Api.delete(
                              `/userSettings/keyDbLocale?user=${username}`
                          )
                        : this.d2Api.post(
                              parseLocaleUrl('Db', username, dbLocale)
                          )
                localePromises.push(dbLocalePromise)
            }

            // Dummy follow-up request to prevent Promise.all error
            // if neither locale fields need updating
            if (localePromises.length === 0) {
                localePromises.push(
                    Promise.resolve('No locale changes detected')
                )
            }
            // Updating locales after user in case the user is new
            return Promise.all(localePromises)
        })
    }

    /**************************
     ***** USER GROUPS ********
     **************************/

    saveUserGroup(data) {
        if (data.id) {
            return this.d2Api.update(
                `/userGroups/${data.id}?mergeMode=MERGE`,
                data
            )
        }
        return this.d2Api.post('/userGroups', data)
    }

    getManagedUsers = () => {
        const data = {
            fields: ['id', 'displayName', 'userCredentials[username]'],
            paging: false,
        }
        return this.d2.models.user.list(data).then(appendUsernameToDisplayName)
    }

    /**************************
     ****** USER ROLES ********
     **************************/

    // TODO: A proper API endpoint will be made available for this call once ALL struts apps
    // have been ported to React. Once this is done we need to update this method.
    getGroupedAuthorities = () => {
        if (this.groupedAuths) {
            // Return cached version if available
            return Promise.resolve(this.groupedAuths)
        }
        const url = `${this.getContextPath()}/dhis-web-commons/security/getSystemAuthorities.action`
        return this.d2Api.request('GET', url).then(({ systemAuthorities }) => {
            // Store on instance for subsequent requests
            return (this.groupedAuths = groupAuthorities(systemAuthorities))
        })
    }

    // Calling role.save() would result in an error in d2 because d2 expects you always want to
    // save { id: <ID> } objects but authorities should be saved as a plain JSON array
    saveRole(data) {
        if (data.id) {
            return this.d2Api.update(`/userRoles/${data.id}`, data)
        } else {
            return this.d2Api.post('/userRoles/', data)
        }
    }

    /**************************
     ****** CURRENT USER ******
     **************************/

    getCurrentUser = () => {
        return this.d2.currentUser
    }

    getCurrentUserGroupsAndRoles = () => {
        return this.d2Api
            .get('me', {
                fields: 'userGroups[id],userCredentials[userRoles[id]]',
            })
            .then(res => ({
                userGroupIds: res.userGroups.map(({ id }) => id),
                userRoleIds: res.userCredentials.userRoles.map(({ id }) => id),
            }))
    }

    initCurrentUser = () => {
        return Promise.all([
            this.getCurrentUserGroupsAndRoles(),
            this.getCurrentUserOrgUnits(),
            this.getSystemOrgUnitRoots(),
        ]).then(
            ([
                { userGroupIds, userRoleIds },
                {
                    organisationUnits,
                    dataViewOrganisationUnits,
                    teiSearchOrganisationUnits,
                },
                systemOrganisationUnitRoots,
            ]) => {
                return Object.assign(this.d2.currentUser, {
                    userGroupIds,
                    userRoleIds,
                    organisationUnits,
                    dataViewOrganisationUnits,
                    teiSearchOrganisationUnits,
                    systemOrganisationUnitRoots,
                })
            }
        )
    }

    refreshCurrentUser = () => {
        const CurrentUserClass = Object.getPrototypeOf(
            this.d2.currentUser
        ).constructor
        const meFields = [
            ':all',
            '!userGroups',
            '!organisationUnits',
            'userCredentials[:all,!user,!userRoles]',
        ]
        const models = this.d2.models

        return Promise.all([
            this.d2Api.get('me', { fields: meFields }),
            this.d2Api.get('me/authorization'),
            this.d2Api.get('userSettings'),
        ]).then(([me, authorities, userSettings]) => {
            this.d2.currentUser = CurrentUserClass.create(
                me,
                authorities,
                models,
                userSettings
            )
            return this.initCurrentUser()
        })
    }

    getCurrentUserOrgUnits = () => {
        return this.d2.models.users.get(
            this.d2.currentUser.id,
            CURRENT_USER_ORG_UNITS_FIELDS
        )
    }

    getSystemOrgUnitRoots = () => {
        return this.d2.models.organisationUnits
            .list({
                paging: false,
                level: 1,
                fields: 'id,path,displayName,children::isNotEmpty',
            })
            .then(modelCollection => {
                return modelCollection.toArray()
            })
    }

    updateCurrentUserGroupMembership = (groupId, deleteMembership) => {
        const method = deleteMembership ? 'delete' : 'post'
        const url = `/users/${this.d2.currentUser.id}/userGroups/${groupId}`
        return this.d2Api[method](url)
    }
}
export default new Api()
