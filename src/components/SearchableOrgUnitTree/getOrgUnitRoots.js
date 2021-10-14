import { DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS } from '../../containers/UserForm/config'

/**
 * Organisation unit trees should have different roots depending on the context.
 * @param {String} orgUnitType - The type orgUnits to return
 * @param {Object} currentUser - state.currentUser
 * @returns {Array|null} The roots of the organisation unit tree to be displayed
 * @function
 */

const getOrgUnitRoots = (orgUnitType, currentUser) => {
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

export default getOrgUnitRoots
