import { getAttributeValues } from '../../attributes.js'

const ATTRIBUTE_VALUES = 'attributeValues'

export const createPostRequestBody = ({ values, attributes }) => {
    const { name, code, members, managedGroups } = values

    return {
        name,
        code,
        users: members.additions.map(({ id }) => ({ id })),
        managedGroups: managedGroups.map((id) => ({ id })),
        attributeValues: getAttributeValues({ attributes, values }),
    }
}

export const createJsonPatchRequestBody = ({
    values,
    attributes,
    dirtyFields,
}) => {
    const dirtyFieldsArray = Object.keys(dirtyFields).filter(
        (key) => dirtyFields[key]
    )
    const patch = dirtyFieldsArray.reduce((acc, key) => {
        if (key !== 'members' && !key.startsWith(ATTRIBUTE_VALUES)) {
            const value =
                key === 'managedGroups'
                    ? values[key].map((id) => ({ id }))
                    : values[key]

            acc.push({
                op: 'replace',
                path: '/' + key,
                value: value ?? null,
            })
        }
        return acc
    }, [])

    // Replace all attribute values if any were changed.
    // There is no way to update individual attributes.
    const anyDirtyAttributes = dirtyFieldsArray.some((key) =>
        key.startsWith(ATTRIBUTE_VALUES)
    )

    if (anyDirtyAttributes) {
        patch.push({
            op: 'replace',
            path: `/${ATTRIBUTE_VALUES}`,
            value: getAttributeValues({ attributes, values }),
        })
    }

    if (dirtyFields.members) {
        const { additions, removals } = values.members
        for (const addition of additions) {
            patch.push({
                op: 'add',
                path: '/users/-',
                value: { id: addition.id },
            })
        }
        for (const removal of removals) {
            patch.push({
                op: 'remove-by-id',
                path: '/users',
                id: removal.id,
            })
        }
    }

    return patch
}
