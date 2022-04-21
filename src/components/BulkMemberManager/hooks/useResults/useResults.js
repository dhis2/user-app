import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { useSet } from './useSet'

export const useResults = ({
    canManageMembers,
    allQuery,
    membersQuery,
    nonMembersQuery,
    transformQueryResponse,
    filterDebounceMs,
    mode,
}) => {
    const membersDataQuery = useDataQuery(membersQuery, { lazy: true })
    const nonMembersDataQuery = useDataQuery(
        canManageMembers ? nonMembersQuery : allQuery,
        { lazy: true }
    )
    const [prevMembers, setPrevMembers] = useState()
    const [prevNonMembers, setPrevNonMembers] = useState()
    const [membersPage, setMembersPage] = useState(1)
    const [nonMembersPage, setNonMembersPage] = useState(1)
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
    const transformQueryResponseRef = useRef()
    transformQueryResponseRef.current = transformQueryResponse

    useEffect(() => {
        if (mode === 'MEMBERS') {
            setPrevMembers(
                membersDataQuery.data &&
                    transformQueryResponseRef.current(
                        membersDataQuery.data.results
                    )
            )
            membersDataQuery.refetch({
                page: membersPage,
                filter: debouncedMembersFilter,
            })
        } else {
            setPrevNonMembers(
                nonMembersDataQuery.data &&
                    transformQueryResponseRef.current(
                        nonMembersDataQuery.data.results
                    )
            )
            nonMembersDataQuery.refetch({
                page: nonMembersPage,
                filter: debouncedNonMembersFilter,
            })
        }
    }, [
        mode,
        membersPage,
        nonMembersPage,
        debouncedMembersFilter,
        debouncedNonMembersFilter,
    ])

    const { called, loading, error, data } =
        mode === 'MEMBERS' ? membersDataQuery : nonMembersDataQuery
    const prevResults = mode === 'MEMBERS' ? prevMembers : prevNonMembers
    const results = data ? transformQueryResponse(data.results) : prevResults
    const [page, setPage] =
        mode === 'MEMBERS'
            ? [membersPage, setMembersPage]
            : [nonMembersPage, setNonMembersPage]
    const selected = mode === 'MEMBERS' ? selectedMembers : selectedNonMembers
    const [filter, setFilter] =
        mode === 'MEMBERS'
            ? [membersFilter, setMembersFilter]
            : [nonMembersFilter, setNonMembersFilter]

    return {
        loading: !called || loading,
        error,
        results,
        pager: {
            ...data?.results.pager,
            page,
        },
        setPage,
        selected,
        toggleSelected: id => {
            if (selected.has(id)) {
                selected.delete(id)
            } else {
                selected.add(id)
            }
        },
        toggleAllSelected: () => {
            const ids = results.map(({ id }) => id)
            if (ids.some(id => selected.has(id))) {
                ids.forEach(selected.delete)
            } else {
                ids.forEach(selected.add)
            }
        },
        filter,
        setFilter,
    }
}
