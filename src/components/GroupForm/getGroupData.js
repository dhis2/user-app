import { getAttributeValues } from '../../attributes'

const wrapIds = ids => ids.map(id => ({ id }))

export const getGroupData = ({ values, attributes }) => {
    const { name, code, managedGroups } = values

    return {
        name,
        code,
        managedGroups: wrapIds(managedGroups),

        attributeValues: getAttributeValues({ attributes, values }),
    }
}
