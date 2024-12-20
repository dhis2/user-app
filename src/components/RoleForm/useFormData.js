import { useMemo } from 'react'
import { useSystemInformation } from '../../providers/index.js'
import { groupAuthorities } from './groupAuthorities/index.js'

const makeOptions = (array) =>
    array.map(({ name, id }) => ({
        label: name,
        value: id,
    }))

export const useFormData = () => {
    const { authorities: systemAuthorities } = useSystemInformation()

    const authorities = useMemo(() => {
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
    }, [systemAuthorities])

    return authorities
}
