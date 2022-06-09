import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { groupAuthorities } from './groupAuthorities/index.js'

const query = {
    authorities: {
        resource: 'authorities',
        params: {
            fields: ['id', 'name'],
        },
    },
}

const makeOptions = (array) =>
    array.map(({ name, id }) => ({
        label: name,
        value: id,
    }))

export const useFormData = () => {
    const { loading, error, data } = useDataQuery(query)
    const authorities = useMemo(() => {
        if (!data) {
            return
        }

        const {
            authorities: { systemAuthorities },
        } = data
        const groupedAuthorities = groupAuthorities(systemAuthorities)

        return {
            metadataAuthorities: groupedAuthorities.metadata,
            appAuthorityOptions: makeOptions(groupedAuthorities.apps),
            trackerAuthorityOptions: makeOptions(groupedAuthorities.tracker),
            importExportAuthorityOptions: makeOptions(
                groupedAuthorities.importExport
            ),
            systemAuthorityOptions: makeOptions(groupedAuthorities.system),
        }
    }, [data])

    if (loading || error) {
        return { loading, error }
    }
    return authorities
}
