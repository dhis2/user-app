import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useRef } from 'react'
import { EMPTY_AUTHORITY_SECTIONS } from './constants'
import { filterAuthorities } from './filterAuthorities'
import { groupAuthorities } from './groupAuthorities.js'
import { selectAuthorities } from './selectAuthorities'

const query = {
    authorities: {
        resource: 'authorities',
        params: {
            fields: ['id', 'name'],
        },
    },
}
export const useAuthorities = ({
    selected,
    filterString,
    filterSelectedOnly,
    reduxFormOnChange,
}) => {
    const allAuthoritiesRef = useRef(null)
    const [searchChunks, setSearchChunks] = useState(null)
    const [authorities, setAuthorities] = useState(EMPTY_AUTHORITY_SECTIONS)
    const { loading, error, data } = useDataQuery(query)

    useEffect(() => {
        const newSearchChunks = filterString
            ? filterString.toLowerCase().split(' ')
            : null

        if (data) {
            if (!allAuthoritiesRef.current) {
                allAuthoritiesRef.current = groupAuthorities(
                    data.authorities.systemAuthorities
                )
            }

            const selectedSet = new Set(selected)
            const filteredAuthorities = filterAuthorities({
                allAuthorities: allAuthoritiesRef.current,
                selectedSet,
                searchChunks: newSearchChunks,
                filterSelectedOnly,
            })
            const selectedFilteredAuthorities = selectAuthorities({
                authorities: filteredAuthorities,
                selectedSet,
            })

            setSearchChunks(newSearchChunks)
            setAuthorities(selectedFilteredAuthorities)
        }
    }, [data, selected, filterString, filterSelectedOnly])

    useEffect(() => {
        reduxFormOnChange(selected)
    }, [selected])

    return {
        loading,
        error,
        authorities,
        searchChunks,
    }
}
