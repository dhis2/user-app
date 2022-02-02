const resource = 'attributes'
const fields = [
    'id',
    'displayName',
    'mandatory',
    'unique',
    'valueType',
    'optionSet[options[id,displayName]]',
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
