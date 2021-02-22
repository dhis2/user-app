/**
 * A collection of selector functions that return derived state slices. Results are memoized where possible.
 * @module selectors
 */
import memoize from 'lodash.memoize'
import isUndefined from 'lodash.isundefined'
import i18n from '@dhis2/d2-i18n'
import {
    USER_PROPS,
    USER_CRED_PROPS,
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
    INVITE,
    INVITE_USER,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    SET_PASSWORD,
} from '../containers/UserForm/config'
import { getFields as getUserGroupFields } from '../containers/GroupForm/config'
import asArray from '../utils/asArray'
import getNestedProp from '../utils/getNestedProp'

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
    if (propName === DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS) {
        initialValues[propName] = [
            ...sourceObject.catDimensionConstraints,
            ...sourceObject.cogsDimensionConstraints,
        ]
    } else if (
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

/**
 * Produces initial values for redux form
 * @param {Object} user - A d2 user model instance (state.currentItem)
 * @param {Object} locales - Contains available and selected locales for the UI and DB
 * @returns {Object} Initial values for the redux form wrapping the UserForm component
 * @function
 */
export const userFormInitialValuesSelector = memoize(
    (user, locales, attributeFields) => {
        const initialValues = {
            [INVITE]: SET_PASSWORD,
        }

        if (user.id) {
            USER_PROPS.forEach(propName => {
                addInitialValueFrom(user, initialValues, propName)
            })

            USER_CRED_PROPS.forEach(propName => {
                addInitialValueFrom(
                    user.userCredentials,
                    initialValues,
                    propName
                )
            })

            attributeFields.forEach(
                field => (initialValues[field.name] = field.value)
            )
        }

        // 'en' is a fallback for systems that have no default system UI locale specified
        initialValues[INTERFACE_LANGUAGE] = locales.ui.selected || 'en'
        initialValues[DATABASE_LANGUAGE] = locales.db.selected

        return initialValues
    }
)

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
 * Used to combine cat and cog dimension restrictions into a single array
 * @param {Object} user - A d2 user model instance (state.currentItem)
 * @returns {Object} An array of cat and cog IDs
 * @function
 */
export const analyticsDimensionsRestrictionsSelector = memoize(user => {
    const catConstraints = asArray(
        getNestedProp('userCredentials.catDimensionConstraints', user)
    )
    const cogsConstraints = asArray(
        getNestedProp('userCredentials.cogsDimensionConstraints', user)
    )
    return [...catConstraints, ...cogsConstraints]
})

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

/**
 * Organisation unit trees should have different roots depending on the context.
 * @param {String} orgUnitType - The type orgUnits to return
 * @param {Object} currentUser - state.currentUser
 * @returns {Array|null} The roots of the organisation unit tree to be displayed
 * @function
 */
export const orgUnitRootsSelector = (orgUnitType, currentUser) => {
    const systemOrgRoots = currentUser.systemOrganisationUnitRoots
    const requestedOrgUnitRoots = currentUser[orgUnitType]
    const fallBackOrgUnitRoots =
        currentUser[DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS]

    let orgUnitRoots = null
    if (currentUser.authorities.has('ALL')) {
        orgUnitRoots = systemOrgRoots
    } else if (requestedOrgUnitRoots.size === 0) {
        orgUnitRoots = fallBackOrgUnitRoots.toArray()
    } else if (fallBackOrgUnitRoots.size > 0) {
        orgUnitRoots = fallBackOrgUnitRoots.toArray()
    }

    return orgUnitRoots
}

/**
 * The redux form `formValueSelector` was returning incorrect values,
 * so this selector was born.
 * @param {Object} formState - state.form.userForm
 * @returns {Boolean} - True if select box was switched to 'Invite user'
 * @function
 */
export const inviteUserValueSelector = formState => {
    const fields = formState && formState.registeredFields
    const values = formState && formState.values
    const isRenderedField = Boolean(fields && fields[INVITE])
    const fieldValue = isRenderedField && values && values[INVITE]

    return fieldValue === INVITE_USER
}
