const wrapIds = ids => ids.map(id => ({ id }))

export const getGroupData = ({ values, group, attributes }) => {
    const { name, code, managedGroups } = values

    return {
        id: group?.id,
        name,
        code,
        managedGroups: wrapIds(managedGroups),

        attributeValues: attributes.map(attribute => ({
            attribute: {
                id: attribute.id,
            },
            value: values.attributeValues[attribute.id],
        })),
    }
}
