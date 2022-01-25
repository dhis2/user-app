import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    userGroups: {
        resource: 'userGroups',
        params: {
            fields: ['id', 'displayName'],
            paging: false,
        },
    },
}

const makeOptions = array =>
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
    } = data

    return {
        userGroupOptions: makeOptions(userGroups),
    }
}
