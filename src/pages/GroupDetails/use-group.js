import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'

const query = {
    group: {
        resource: 'userGroups',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'access', 'displayName'],
        },
    },
}

const useGroup = (groupId) => {
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: groupId })
    }, [groupId])

    return {
        loading: !called || loading,
        error,
        group: data?.group,
    }
}

export default useGroup
