import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useMemo, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { useSet } from './useSet'

const FILTER_DEBOUNCE_MS = 375

export const useUsers = ({ groupId, mode }) => {
    // Use useMemo to silence warnings from useDataQuery about dynamic queries
    const queries = useMemo(() => {
        const resource = `userGroups/${groupId}/users/gist`
        const params = {
            fields: ['id', 'name', 'username'],
            total: true,
            pageSize: 10,
        }

        // The gist API does not support filtering by full name, so we must
        // split the filter into space-separated tokens and filter by those
        // tokens. A filter group is created for each token, with filters within
        // each group being combined with a logical OR and the groups being
        // combined with a logical AND.
        const getFilterParams = filterQuery => {
            const filterTokens = filterQuery.split(' ')
            let filter = undefined
            if (filterQuery !== '') {
                filter = filterTokens.flatMap((token, index) => {
                    if (token === '') {
                        return []
                    }

                    const filterFields = ['firstName', 'surname', 'username']
                    return filterFields.map(
                        field => `${index}:${field}:ilike:${token}`
                    )
                })
            }

            return {
                rootJunction: filterTokens.length === 1 ? 'OR' : 'AND',
                filter,
            }
        }

        return {
            members: {
                users: {
                    resource,
                    params: ({ page, filter }) => ({
                        ...params,
                        ...getFilterParams(filter),
                        page,
                    }),
                },
            },
            nonMembers: {
                users: {
                    resource,
                    params: ({ page, filter }) => ({
                        ...params,
                        ...getFilterParams(filter),
                        page,
                        inverse: true,
                    }),
                },
            },
        }
    }, [groupId])
    const membersDataQuery = useDataQuery(queries.members, { lazy: true })
    const nonMembersDataQuery = useDataQuery(queries.nonMembers, { lazy: true })
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
        FILTER_DEBOUNCE_MS
    )
    const [debouncedNonMembersFilter] = useDebounce(
        nonMembersFilter,
        FILTER_DEBOUNCE_MS
    )

    useEffect(() => {
        if (mode === 'MEMBERS') {
            setPrevMembers(membersDataQuery.data?.users.users)
            membersDataQuery.refetch({
                page: membersPage,
                filter: debouncedMembersFilter,
            })
        } else {
            setPrevNonMembers(nonMembersDataQuery.data?.users.users)
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
    const prevUsers = mode === 'MEMBERS' ? prevMembers : prevNonMembers
    const users = data?.users.users || prevUsers
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
        users,
        pager: {
            ...data?.users.pager,
            page,
        },
        setPage,
        selected,
        toggleSelected: userId => {
            if (selected.has(userId)) {
                selected.delete(userId)
            } else {
                selected.add(userId)
            }
        },
        toggleAllSelected: () => {
            const userIds = users.map(({ id }) => id)
            if (userIds.some(userId => selected.has(userId))) {
                userIds.forEach(selected.delete)
            } else {
                userIds.forEach(selected.add)
            }
        },
        filter,
        setFilter,
    }
}
