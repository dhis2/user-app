export const getJsonPatch = ({ userData, dirtyFields }) => {
    const changes = []

    for (const [field, value] of Object.entries(userData)) {
        let modified = dirtyFields.has(field)
        // TODO: Once a replace-by-key op is supported, only submit attribute
        // values that have changed
        if (field === 'attributeValues') {
            modified = true
        }
        // Dimension constraints are combined into a single input
        // component, but need to be stored separately
        if (
            field === 'catDimensionConstraints' ||
            field === 'cogsDimensionConstraints'
        ) {
            modified = dirtyFields.has('dimensionConstraints')
        }

        if (modified) {
            changes.push({
                op: 'add',
                path: '/' + field,
                value: value ?? null,
            })
        }
    }

    return changes
}
