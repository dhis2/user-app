import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useMemo, useEffect } from 'react'

// XXX: remove once backend supports name and username
// See https://github.com/dhis2/dhis2-core/pull/9126 is merged
const fixUsers = users => {
    if (users) {
        return users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.surname}`,
            username: user.id.slice(0, 4),
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
                // TODO: needs backend support
                // 'username',
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
    const [page, setPage] =
        mode === 'MEMBERS'
            ? [membersPage, setMembersPage]
            : [nonMembersPage, setNonMembersPage]
    const prevUsers = mode === 'MEMBERS' ? prevMembers : prevNonMembers

    return {
        loading: !called || loading,
        error,
        users: fixUsers(data?.users.users || prevUsers),
        pager: {
            ...data?.users.pager,
            page,
        },
        setPage,
    }
}
