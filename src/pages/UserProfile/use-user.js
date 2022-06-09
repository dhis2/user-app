import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect } from 'react'

const query = {
    user: {
        resource: 'users',
        id: ({ id }) => id,
        params: {
            fields: [
                'access',

                'id',
                'username',
                'displayName',
                'lastLogin',
                'created',
                'firstName',
                'surname',

                'email',
                'phoneNumber',

                'organisationUnits[displayName]',
                'userRoles[displayName]',

                'introduction',
                'jobTitle',
                'employer',
                'gender',
                'languages',
                'education',
                'interests',
                'nationality',
                'birthday',
            ],
        },
    },
}

const useUser = (userId) => {
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        refetch({ id: userId })
    }, [userId])

    return {
        loading: !called || loading,
        error,
        user: data?.user,
    }
}

export default useUser
