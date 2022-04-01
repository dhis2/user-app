export const getJsonPatch = ({ roleData, dirtyFields }) => {
    const changes = []

    for (const [field, value] of Object.entries(roleData)) {
        let modified = dirtyFields.has(field)
        // TODO: Once a replace-by-key op is supported, only submit attribute
        // values that have changed
        if (field === 'attributeValues') {
            modified = true
        }
        // TODO: Once a replace-by-key op is supported, only submit authorities
        // that have changed
        if (
            field === 'authorities' &&
            (dirtyFields.has('metadataAuthorities') ||
                dirtyFields.has('appAuthorities') ||
                dirtyFields.has('trackerAuthorities') ||
                dirtyFields.has('importExportAuthorities') ||
                dirtyFields.has('systemAuthorities'))
        ) {
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
