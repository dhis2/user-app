import { useDataQuery } from '@dhis2/app-runtime'
import debounce from 'lodash.debounce'
import { useState, useEffect, useRef } from 'react'
import { filterAuthorities } from './filterAuthorities'
import {
    groupAuthorities,
    getEmptyAuthorityGroups,
} from './groupAuthorities.js'
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
    const [ready, setReady] = useState(false)
    const allGroupedAuthoritiesRef = useRef(null)
    const authoritySelectionManagerRef = useRef(
        makeAuthoritySelectionManager(initiallySelected, reduxFormOnChange)
    )
    // const columnSelectionManagerRef = useRef(null)
    const [searchChunks, setSearchChunks] = useState(null)
    const [authorities, setAuthorities] = useState(getEmptyAuthorityGroups())
    const { fetching: loading, error, data } = useDataQuery(query)
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
        if (data && !loading) {
            const { systemAuthorities } = data.authorities

            if (!allGroupedAuthoritiesRef.current) {
                allGroupedAuthoritiesRef.current =
                    groupAuthorities(systemAuthorities)
            }

            if (authoritySelectionManagerRef.current.isEmpty()) {
                authoritySelectionManagerRef.current.populate(
                    systemAuthorities,
                    allGroupedAuthoritiesRef.current
                )
            }

            setAuthorities(
                filterAuthorities({
                    allGroupedAuthorities: allGroupedAuthoritiesRef.current,
                    isSelected: authoritySelectionManagerRef.current.isSelected,
                    searchChunks: null,
                    filterSelectedOnly: false,
                })
            )
            setReady(true)
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

    useEffect(
        () => () => {
            debouncedFilterUpdateRef.current.cancel()
            allGroupedAuthoritiesRef.current = null
            authoritySelectionManagerRef.current = null
            debouncedFilterUpdateRef.current = null
        },
        []
    )

    return {
        loading: loading || !ready,
        error,
        authorities,
        searchChunks,
        authoritySelectionManager: authoritySelectionManagerRef.current,
    }
}
