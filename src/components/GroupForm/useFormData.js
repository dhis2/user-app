import { useDataQuery } from '@dhis2/app-runtime'
import { groupAttributesQuery } from '../../attributes.js'

const query = {
    userGroups: {
        resource: 'userGroups',
        params: {
            fields: ['id', 'displayName'],
            paging: false,
        },
    },
    attributes: groupAttributesQuery,
}

const makeOptions = (array) =>
    array.map(({ displayName, name, id }) => ({
        label: displayName || name,
        value: id,
    }))

export const useFormData = () => {
    const { loading, error, data } = useDataQuery(query)

    if (loading || error) {
        return { loading, error }
    }

    const {
        userGroups: { userGroups },
        attributes: { attributes },
    } = data

    return {
        userGroupOptions: makeOptions(userGroups),
        attributes,
    }
}
