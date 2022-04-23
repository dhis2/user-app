import { useMemo } from 'react'

// The gist API does not support filtering by a user's full name, so we must
// split the filter into space-separated tokens and filter by those tokens. A
// filter group is created for each token, with filters within each group being
// combined with a logical OR and the groups being combined with a logical AND.
const getGistFilterParams = filterQuery => {
    const filterTokens = filterQuery.split(' ')
    let filter = undefined
    if (filterQuery !== '') {
        filter = filterTokens.flatMap((token, index) => {
            if (token === '') {
                return []
            }

            const filterFields = ['firstName', 'surname', 'username']
            return filterFields.map(field => `${index}:${field}:ilike:${token}`)
        })
    }

    return {
        rootJunction: filterTokens.length === 1 ? 'OR' : 'AND',
        filter,
    }
}

export const useQueries = ({ groupId }) => {
    const params = {
        fields: ['id', 'name', 'username'],
        // Disable totals for performance reasons
        total: false,
        pageSize: 10,
    }

    // Use useMemo to silence warnings from useDataQuery about dynamic queries
    return useMemo(() => {
        const resource = `userGroups/${groupId}/users/gist`

        return {
            allQuery: {
                results: {
                    resource: 'users',
                    params: ({ page, filter }) => ({
                        ...params,
                        query: filter,
                        page,
                    }),
                },
            },
            membersQuery: {
                results: {
                    resource,
                    params: ({ page, filter }) => ({
                        ...params,
                        ...getGistFilterParams(filter),
                        page,
                    }),
                },
            },
            nonMembersQuery: {
                results: {
                    resource,
                    params: ({ page, filter }) => ({
                        ...params,
                        ...getGistFilterParams(filter),
                        page,
                        inverse: true,
                    }),
                },
            },
        }
    }, [groupId])
}