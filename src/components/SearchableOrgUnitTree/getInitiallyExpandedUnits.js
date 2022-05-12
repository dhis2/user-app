import removeLastPathSegment from './removeLastPathSegment.js'

const getInitiallyExpandedUnits = (orgUnitModels) =>
    orgUnitModels.reduce((expandedUnits, orgUnit) => {
        const strippedPath = removeLastPathSegment(orgUnit.path)
        if (strippedPath) {
            expandedUnits.push(strippedPath)
        }
        return expandedUnits
    }, [])

export default getInitiallyExpandedUnits
