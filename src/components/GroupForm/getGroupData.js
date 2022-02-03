import { getAttributeValues } from '../../attributes'

const wrapIds = ids => ids.map(id => ({ id }))

export const getGroupData = ({ values, group, attributes }) => {
    const { name, code, managedGroups } = values

    return {
        // Because the data object is used as the payload of a PUT request,
        // properties that are omitted will be removed. To prevent this, all
        // remaining owned properties are copied from the user to the data
        // object.
        ...group,

        name,
        code,
        managedGroups: wrapIds(managedGroups),

        attributeValues: getAttributeValues({ attributes, values }),
    }
}
