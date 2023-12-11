/**
 * @param {Object} orgUnits - An array of organisation units which has been filtered on the server by a query string
 * @param {*} orgUnitType - The type of organisation unit that should be used to restrict the results by
 * @param {Object} cuurentUser - the current user
 * @returns {Array} - A filtered array organisation units which the current user has access to
 * @function
 */
export const getRestrictedOrgUnits = (orgUnits, orgUnitType, currentUser) => {
    // Superuser can always see all org units
    if (currentUser.authorities.includes('ALL')) {
        return orgUnits
    }

    // Try the requested orgUnitType first and use currentUser.organisationUnits as fallback
    const availableOrgUnits =
        currentUser[orgUnitType]?.length > 0
            ? currentUser[orgUnitType]
            : currentUser.organisationUnits

    const availableOrgUnitIDs = new Set(availableOrgUnits.map(({ id }) => id))

    return orgUnits.filter((unit) => {
        const isAvailableUnit = availableOrgUnitIDs.has(unit.id)
        const hasAvailableAncestor =
            !isAvailableUnit &&
            unit.ancestors.some((ancestor) =>
                availableOrgUnitIDs.has(ancestor.id)
            )

        return isAvailableUnit || hasAvailableAncestor
    })
}
