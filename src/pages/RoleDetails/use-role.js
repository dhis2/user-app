import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'

const query = {
    role: {
        resource: 'userRoles',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'access', 'displayName'],
        },
    },
}

const useRole = (roleId) => {
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: roleId })
    }, [roleId])

    return {
        loading: !called || loading,
        error,
        role: data?.role,
    }
}

export default useRole
