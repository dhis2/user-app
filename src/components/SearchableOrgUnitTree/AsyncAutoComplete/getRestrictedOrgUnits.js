import { DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS } from '../../../containers/UserForm/config.js'
import store from '../../../store.js'

/**
 * @param {Object} orgUnits - An array of organisation units which has been filtered on the server by a query string
 * @param {*} orgUnitType - The type of organisation unit that should be used to restrict the results by
 * @returns {Array} - A filtered array organisation units which the current user has access to
 * @function
 */
export const getRestrictedOrgUnits = (orgUnits, orgUnitType) => {
    const { currentUser } = store.getState()

    // Superuser can always see all org units
    if (currentUser.authorities.has('ALL')) {
        return orgUnits
    }

    // Try the requested orgUnitType first and use currentUser.organisationUnits as fallback
    const availableOrgUnits =
        currentUser[orgUnitType].size > 0
            ? currentUser[orgUnitType]
            : currentUser[DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS]

    return orgUnits.filter(unit => {
        const isAvailableUnit = Boolean(availableOrgUnits.get(unit.id))
        const hasAvailableAncestor =
            !isAvailableUnit &&
            unit.ancestors.some(ancestor =>
                Boolean(availableOrgUnits.get(ancestor.id))
            )

        return isAvailableUnit || hasAvailableAncestor
    })
}
