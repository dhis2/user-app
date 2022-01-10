/**
 * A collection of selector functions that return derived state slices. Results are memoized where possible.
 * @module selectors
 */
import i18n from '@dhis2/d2-i18n'
import isUndefined from 'lodash.isundefined'
import memoize from 'lodash.memoize'
import { getFields as getUserGroupFields } from '../containers/GroupForm/config'
import asArray from '../utils/asArray'

/**
 * @param {Object} pager - A d2 Pager instance
 * @returns {Object} The d2 Pager instance with an appended 'currentlyShown' property
 * @function
 */
export const pagerSelector = memoize(pager => {
    if (pager === null) {
        return pager
    }
    const {
        total,
        pageCount,
        page,
        query: { pageSize },
    } = pager
    const pageCalculationValue =
        total - (total - (pageCount - (pageCount - page)) * pageSize)
    const startItem = 1 + pageCalculationValue - pageSize
    const endItem = pageCalculationValue

    pager.currentlyShown = `${startItem} - ${endItem > total ? total : endItem}`
    return pager
})

/**
 * @param {Object} list - A d2 list ModelCollection instance
 * @param {Object} [groupMemberships] - An array of groupMembership IDs (userGroup only)
 * @returns {Array} An array of d2 model instances with properties appended for use in the List component
 * @function
 */
export const listSelector = (list, groupMemberships) => {
    if (!list || typeof list === 'string') {
        return list
    }

    const listType = list.modelDefinition.name
    return list
        .toArray()
        .map(item => listMappings[listType](item, groupMemberships))
}

const listMappings = {
    user: item => {
        item.userName = item.userCredentials.username
        item.disabled = item.userCredentials.disabled
        item.accountExpiry = item.userCredentials.accountExpiry
        item.lastLogin = item.userCredentials.lastLogin
        return item
    },
    userRole: item => item,
    userGroup: (item, groupMemberships) => {
        item.currentUserIsMember = groupMemberships.includes(item.id)
        return item
    },
}

/**
 * @param {Object} orgUnits - an array of d2 organisation unit instances
 * @returns {String} Either a comma delimited list of organisation unit names, or a count of selected organisation units phrase
 * @function
 */
export const orgUnitsAsStringSelector = memoize(orgUnits => {
    return orgUnits.length < 3
        ? orgUnits.map(unit => unit.displayName).join(', ')
        : i18n.t('{{count}} selected', { count: orgUnits.length })
})

const addInitialValueFrom = (sourceObject, initialValues, propName) => {
    if (
        (sourceObject[propName] && !isUndefined(sourceObject[propName].size)) ||
        Array.isArray(sourceObject[propName])
    ) {
        initialValues[propName] = asArray(sourceObject[propName]).map(
            ({ id }) => id
        )
    } else {
        initialValues[propName] = sourceObject[propName]
    }
}

export const userGroupFormInitialValuesSelector = memoize(
    (userGroup, attributeFields) => {
        const initialValues = {}

        getUserGroupFields().forEach(field => {
            addInitialValueFrom(userGroup, initialValues, field.name)
        })

        attributeFields.forEach(
            field => (initialValues[field.name] = field.value)
        )

        return initialValues
    }
)

/**
 * A short item is a basic version of state.currentItem, derived from a list.
 * It is used to display basic information in a FormLoader or DetailSummary component
 * while the full version of the currentItem is being fetched.
 * @param {String} id - The id of the model selected in a list
 * @param {Object} list - A d2  model collection instance instance (state.list)
 * @returns {Object} A d2 model instance containing only a few basic properties
 * @function
 */
export const shortItemSelector = memoize((id, list) => {
    if (!list || !id) {
        return null
    }
    return list.get(id)
})
