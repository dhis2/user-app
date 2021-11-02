import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useMemo, useEffect } from 'react'

// XXX: remove once backend supports name and username
// See https://github.com/dhis2/dhis2-core/pull/9126 is merged
const fixUsers = users => {
    if (users) {
        return users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.surname}`,
            username: user.userCredentials.username,
        }))
    }
}

export const useUsers = ({ groupId, mode }) => {
    // Use useMemo to silence warnings from useDataQuery about dynamic queries
    const queries = useMemo(() => {
        const resource = `userGroups/${groupId}/users/gist`
        const params = {
            fields: [
                'id',
                // TODO: switch to 'username~from(userCredentials.username)'
                // once https://github.com/dhis2/dhis2-core/pull/9126 is merged
                'userCredentials[username]',
                // TODO: switch to 'name' once https://github.com/dhis2/dhis2-core/pull/9126 is merged
                'firstName',
                'surname',
            ],
            total: true,
            pageSize: 10,
        }

        return {
            members: {
                users: {
                    resource,
                    params: ({ page }) => ({
                        ...params,
                        page,
                    }),
                },
            },
            nonMembers: {
                users: {
                    resource,
                    params: ({ page }) => ({
                        ...params,
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
    const [selectedMembers, setSelectedMembers] = useState(new Set())
    const [selectedNonMembers, setSelectedNonMembers] = useState(new Set())

    useEffect(() => {
        if (mode === 'MEMBERS') {
            setPrevMembers(membersDataQuery.data?.users.users)
            membersDataQuery.refetch({ page: membersPage })
        } else {
            setPrevNonMembers(nonMembersDataQuery.data?.users.users)
            nonMembersDataQuery.refetch({ page: nonMembersPage })
        }
    }, [mode, membersPage, nonMembersPage])

    const { called, loading, error, data } =
        mode === 'MEMBERS' ? membersDataQuery : nonMembersDataQuery
    const prevUsers = mode === 'MEMBERS' ? prevMembers : prevNonMembers
    const users = fixUsers(data?.users.users || prevUsers)
    const [page, setPage] =
        mode === 'MEMBERS'
            ? [membersPage, setMembersPage]
            : [nonMembersPage, setNonMembersPage]
    const [selected, setSelected] =
        mode === 'MEMBERS'
            ? [selectedMembers, setSelectedMembers]
            : [selectedNonMembers, setSelectedNonMembers]

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
    }
}
