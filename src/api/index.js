import { getQueryFields, getAttributesWithValueAndId } from './utils'

const CURRENT_USER_ORG_UNITS_FIELDS = {
    fields: [
        'organisationUnits[id,path,displayName,children::isNotEmpty]',
        'dataViewOrganisationUnits[id,path,displayName,children::isNotEmpty]',
        'teiSearchOrganisationUnits[id,path,displayName,children::isNotEmpty]',
    ],
}

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

    // Used by DetailSummary component
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

    isAttributeUnique({ entityType, modelId, attributeId, value }) {
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
}
export default new Api()
