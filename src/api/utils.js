/**
 * This module includes helper functions used by the API class
 * @module Api/utils
 */

import { snakeCase } from 'lodash-es'
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
