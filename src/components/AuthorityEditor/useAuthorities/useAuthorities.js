import { useDataQuery } from '@dhis2/app-runtime'
import debounce from 'lodash.debounce'
import { useState, useEffect, useRef } from 'react'
import { EMPTY_AUTHORITY_SECTIONS } from './constants'
import { filterAuthorities } from './filterAuthorities'
import { groupAuthorities } from './groupAuthorities.js'
import { makeAuthoritySelectionManager } from './makeAuthoritySelectionManager'

const query = {
    authorities: {
        resource: 'authorities',
        params: {
            fields: ['id', 'name'],
        },
    },
}
export const useAuthorities = ({
    initiallySelected,
    filterString,
    filterSelectedOnly,
    reduxFormOnChange,
}) => {
    const allGroupedAuthoritiesRef = useRef(null)
    const authoritySelectionManagerRef = useRef(
        makeAuthoritySelectionManager(initiallySelected, reduxFormOnChange)
    )
    const [searchChunks, setSearchChunks] = useState(null)
    const [authorities, setAuthorities] = useState(EMPTY_AUTHORITY_SECTIONS)
    const { loading, error, data } = useDataQuery(query)
    const debouncedFilterUpdateRef = useRef(
        debounce((filterString, filterSelectedOnly) => {
            const newSearchChunks = filterString
                ? filterString.toLowerCase().split(' ')
                : null

            setSearchChunks(newSearchChunks)
            setAuthorities(
                filterAuthorities({
                    allGroupedAuthorities: allGroupedAuthoritiesRef.current,
                    isSelected: authoritySelectionManagerRef.current.isSelected,
                    searchChunks: newSearchChunks,
                    filterSelectedOnly,
                })
            )
        }, 350)
    )

    useEffect(() => {
        if (data) {
            const { systemAuthorities } = data.authorities

            if (!authoritySelectionManagerRef.current.isEmpty()) {
                authoritySelectionManagerRef.current.populate(systemAuthorities)
            }

            if (!allGroupedAuthoritiesRef.current) {
                allGroupedAuthoritiesRef.current =
                    groupAuthorities(systemAuthorities)
            }

            setAuthorities(
                filterAuthorities({
                    allGroupedAuthorities: allGroupedAuthoritiesRef.current,
                    isSelected: authoritySelectionManagerRef.current.isSelected,
                    searchChunks: null,
                    filterSelectedOnly: false,
                })
            )
        }
    }, [data])

    useEffect(() => {
        if (
            !authoritySelectionManagerRef.current.isEmpty() &&
            allGroupedAuthoritiesRef.current
        ) {
            debouncedFilterUpdateRef.current(filterString, filterSelectedOnly)
        }
    }, [filterString, filterSelectedOnly])

    return {
        loading,
        error,
        authorities,
        searchChunks,
        authoritySelectionManager: authoritySelectionManagerRef.current,
    }
}
