const resource = 'attributes'
const fields = [
    'id',
    'displayName',
    'mandatory',
    'unique',
    'valueType',
    'optionSet[id,valueType,options[id,displayName]]',
]

export const userAttributesQuery = {
    resource,
    params: {
        fields,
        filter: 'userAttribute:eq:true',
        paging: false,
    },
}

export const groupAttributesQuery = {
    resource,
    params: {
        fields,
        filter: 'userGroupAttribute:eq:true',
        paging: false,
    },
}

export const getAttributeValues = ({ attributes, values }) =>
    attributes.map((attribute) => {
        let value = values.attributeValues?.[attribute.id] || ''

        // Handle multi-select option sets: convert array to semicolon-separated string
        if (attribute.optionSet && Array.isArray(value)) {
            value = value.filter((v) => v).join(';')
        }

        if (attribute.valueType === 'TRUE_ONLY' && !value) {
            value = ''
        }

        return {
            attribute: {
                id: attribute.id,
            },
            value,
        }
    })
