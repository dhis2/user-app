const wrapIds = ids => ids.map(id => ({ id }))

export const getGroupData = ({ values, group }) => {
    const { name, code, managedGroups } = values

    return {
        id: group?.id,
        name,
        code,
        managedGroups: wrapIds(managedGroups),
    }
}
