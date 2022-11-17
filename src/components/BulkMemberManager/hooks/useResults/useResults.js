import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { useSet } from './useSet.js'

export const useResults = ({
    pendingChanges,
    canManageMembers,
    allQuery,
    membersGistQuery,
    transformQueryResponse,
    filterDebounceMs,
    mode,
}) => {
    const currentPendingChanges =
        mode === 'MEMBERS' ? pendingChanges.removals : pendingChanges.additions
    const pendingChangesForMode = new Set(
        currentPendingChanges.map(({ id }) => id)
    )
    const prevPageRef = useRef({
        members: {
            pager: undefined,
            results: undefined,
        },
        nonMembers: {
            pager: undefined,
            results: undefined,
        },
    })
    const isMemberMode = mode === 'MEMBERS'
    const allDataQuery = useDataQuery(allQuery, { lazy: true })
    const membersDataQuery = useDataQuery(membersGistQuery, {
        lazy: true,
        variables: {
            inverse: !isMemberMode,
        },
    })
    const { called, loading, error, data, refetch } = canManageMembers
        ? membersDataQuery
        : allDataQuery
    const [results, setResults] = useState([])
    const selectedMembers = useSet()
    const selectedNonMembers = useSet()
    const [membersFilter, setMembersFilter] = useState('')
    const [nonMembersFilter, setNonMembersFilter] = useState('')
    const [debouncedMembersFilter] = useDebounce(
        membersFilter,
        filterDebounceMs
    )
    const [debouncedNonMembersFilter] = useDebounce(
        nonMembersFilter,
        filterDebounceMs
    )
    const [filter, setFilter] = isMemberMode
        ? [membersFilter, setMembersFilter]
        : [nonMembersFilter, setNonMembersFilter]
    const selected = isMemberMode ? selectedMembers : selectedNonMembers
    const queryFilter = isMemberMode
        ? debouncedMembersFilter
        : debouncedNonMembersFilter
    const prevPager = isMemberMode
        ? prevPageRef.current.members.pager
        : prevPageRef.current.nonMembers.pager

    const navigateToPage = useCallback(
        (page) =>
            refetch({ page, filter: queryFilter, inverse: !isMemberMode }),
        [refetch, queryFilter, isMemberMode]
    )

    const updatePrevPageRef = useCallback(
        (results, pager) => {
            if (isMemberMode) {
                prevPageRef.current.members.results = results
                prevPageRef.current.members.pager = pager
            } else {
                prevPageRef.current.nonMembers.results = results
                prevPageRef.current.nonMembers.pager = pager
            }
        },
        [isMemberMode]
    )

    useEffect(() => {
        const prevResults = isMemberMode
            ? prevPageRef.current.members.results
            : prevPageRef.current.nonMembers.results

        if (prevResults) {
            setResults(prevResults)
        } else {
            navigateToPage(1)
        }
    }, [isMemberMode])

    useEffect(() => {
        if (data) {
            const newResults = transformQueryResponse(data.results)
            updatePrevPageRef(newResults, data.results.pager)
            setResults(newResults)
        }
    }, [data])

    useEffect(() => {
        navigateToPage(1)
    }, [debouncedMembersFilter, debouncedNonMembersFilter])

    return {
        loading: !called || loading,
        filter,
        setFilter,
        error,
        results,
        pager: data ? data.results.pager : prevPager,
        navigateToPage,
        isSelected: (id) => selected.has(id),
        isPendingChange: (id) => pendingChangesForMode.has(id),
        deselect: (id) => {
            selected.delete(id)
        },
        toggleSelected: (id) => {
            if (selected.has(id)) {
                selected.delete(id)
            } else {
                selected.add(id)
            }
        },
        toggleAllSelected: (pendingChanges) => {
            const pendingIdsSet = new Set(
                pendingChanges.additions
                    .concat(pendingChanges.removals)
                    .map(({ id }) => id)
            )
            const ids = results.map(({ id }) => id)
            if (ids.some((id) => selected.has(id))) {
                ids.forEach(selected.delete)
            } else {
                ids.forEach((id) => {
                    if (!pendingIdsSet.has(id)) {
                        selected.add(id)
                    }
                })
            }
        },
        clearAllSelected: () => {
            selected.clear()
        },
    }
}
