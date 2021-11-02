import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useMemo, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

const FILTER_DEBOUNCE = 375

export const useUsers = ({ groupId, mode }) => {
    // Use useMemo to silence warnings from useDataQuery about dynamic queries
    const queries = useMemo(() => {
        const resource = `userGroups/${groupId}/users/gist`
        const params = {
            fields: ['id', 'name', 'userCredentials.username~rename(username)'],
            total: true,
            pageSize: 10,
            rootJunction: 'OR',
        }
        const makeFilter = filter => {
            const filterFields = [
                'firstName',
                'surname',
                'userCredentials.username',
            ]
            return filterFields.map(field => `${field}:ilike:${filter}`)
        }

        return {
            members: {
                users: {
                    resource,
                    params: ({ page, filter }) => ({
                        ...params,
                        page,
                        filter: filter !== '' ? makeFilter(filter) : undefined,
                    }),
                },
            },
            nonMembers: {
                users: {
                    resource,
                    params: ({ page, filter }) => ({
                        ...params,
                        page,
                        filter: filter !== '' ? makeFilter(filter) : undefined,
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
    const [selectedMembers, setSelectedMembers] = useState(new Set())
    const [selectedNonMembers, setSelectedNonMembers] = useState(new Set())
    const [membersFilter, setMembersFilter] = useState('')
    const [nonMembersFilter, setNonMembersFilter] = useState('')
    const [debouncedMembersFilter] = useDebounce(membersFilter, FILTER_DEBOUNCE)
    const [debouncedNonMembersFilter] = useDebounce(
        nonMembersFilter,
        FILTER_DEBOUNCE
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
    const [selected, setSelected] =
        mode === 'MEMBERS'
            ? [selectedMembers, setSelectedMembers]
            : [selectedNonMembers, setSelectedNonMembers]
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
            const newSelected = new Set(selected)
            if (selected.has(userId)) {
                newSelected.delete(userId)
            } else {
                newSelected.add(userId)
            }
            setSelected(newSelected)
        },
        toggleAllSelected: () => {
            if (selected.size > 0) {
                setSelected(new Set())
            } else {
                setSelected(new Set(users.map(({ id }) => id)))
            }
        },
        filter,
        setFilter,
    }
}
