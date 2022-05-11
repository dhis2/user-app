export const getJsonPatch = ({ groupData, dirtyFields }) => {
    const changes = []
    console.log

    for (const [field, value] of Object.entries(groupData)) {
        let modified = dirtyFields.has(field)
        // TODO: Once a replace-by-key op is supported, only submit attribute
        // values that have changed
        if (field === 'attributeValues') {
            modified = true
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
