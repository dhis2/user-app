const getInitiallySelectedUnits = (orgUnitModels) =>
    orgUnitModels.map((model) => ({
        id: model.id,
        path: model.path,
        displayName: model.displayName,
    }))

export default getInitiallySelectedUnits
