/**
 * This module includes helper functions used by the API class
 * @module Api/utils
 */

import { snakeCase } from 'lodash-es'
import {
    PAGE as DEFAULT_PAGE,
    PAGE_SIZE as DEFAULT_PAGE_SIZE,
} from '../constants/defaults'
import { USER } from '../constants/entityTypes'
import FIELDS from '../constants/queryFields'

/**
 * Helper function that produces a "fields" array used in the api request payload
 * @param {String} entityName - "user" "userRole" or "userGroup"
 * @param {Boolean} detailFields - Should be true if caller want to get field
 * @return {Array} An array of fields/properties that should be included in the api response
 * @function
 */
export const getQueryFields = (entityName, detailFields) => {
    const formattedEntityName = snakeCase(entityName).toUpperCase()
    const varName = detailFields
        ? `${formattedEntityName}_DETAILS`
        : `${formattedEntityName}_LIST`

    return FIELDS[varName]
}

/**
 * Helper function that prepares the request payload for a getList api call.
 * Combines the
 * @param {Number} page - The page number that should be requested
 * @param {Object} filter - Parameters to filter the result set with on the server
 * @param {Array} fields - Properties that should be returned for each object
 * @returns {Object} A valid request payload for api list calls
 * @function
 */
export const createListRequestData = ({
    page = DEFAULT_PAGE,
    filter,
    fields,
    entityName,
    currentUser,
}) => {
    const {
        query,
        inactiveMonths,
        selfRegistered,
        invitationStatus,
        organisationUnits,
    } = filter

    const requestData = {
        pageSize: DEFAULT_PAGE_SIZE,
        fields,
        page,
        order:
            entityName === USER ? ['firstName:asc', 'surname:asc'] : 'name:asc',
    }

    if (entityName === USER && !isSuperUser(currentUser)) {
        requestData.userOrgUnits = true
        requestData.includeChildren = true
    }

    if (query) {
        requestData.query = query
    }
    if (inactiveMonths) {
        requestData.inactiveMonths = inactiveMonths
    }
    if (selfRegistered) {
        requestData.selfRegistered = selfRegistered
    }
    if (invitationStatus) {
        requestData.invitationStatus = invitationStatus
    }

    if (organisationUnits.length) {
        const ids = organisationUnits.map(unit => unit.id).join()
        requestData.filter = `organisationUnits.id:in:[${ids}]`
    }

    return requestData
}

const isSuperUser = ({ authorities }) => authorities.has('ALL')

export const mapLocale = ({ locale, name }) => {
    return {
        id: locale,
        label: name,
    }
}

export const appendUsernameToDisplayName = userModelCollection =>
    userModelCollection.toArray().map(userModel => {
        const username = userModel.userCredentials.username
        const user = userModel.toJSON()
        user.displayName += ` (${username})`
        return user
    })

export const getAttributesWithValueAndId = (
    userCollection,
    value,
    attributeId
) =>
    userCollection
        .toArray()
        .reduce(
            (list, user) =>
                list.concat(
                    user.attributeValues.filter(
                        attributeValue =>
                            value === attributeValue.value &&
                            attributeId === attributeValue.attribute.id
                    )
                ),
            []
        )
