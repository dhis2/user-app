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
    const fallBackOrgUnitRoots = currentUser.organisationUnits

    if (currentUser.authorities.includes('ALL')) {
        return systemOrgRoots ?? []
    } else if (requestedOrgUnitRoots?.length > 0) {
        return requestedOrgUnitRoots
    } else if (fallBackOrgUnitRoots?.length > 0) {
        return fallBackOrgUnitRoots
    } else {
        return []
    }
}

export default getOrgUnitRoots
