import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    colors,
    Pagination,
    Button,
    IconAdd24,
    DataTableToolbar,
} from '@dhis2/ui'
import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import SearchFilter from '../../components/SearchFilter'
import navigateTo from '../../utils/navigateTo'
import styles from './GroupList.module.css'
import GroupTable from './GroupTable'

const groupsQuery = {
    groups: {
        resource: 'userGroups',
        params: ({ page, pageSize, query }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'user[id,displayName]',
                'publicAccess',
                'userGroupAccesses',
            ],
            order: 'name:asc',
            page,
            pageSize,
            // Passing empty query modifies sorting behaviour
            query: query === '' ? undefined : query,
        }),
    },
}

const GroupList = () => {
    const { called, loading, error, data, refetch } = useDataQuery(
        groupsQuery,
        {
            lazy: true,
        }
    )
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebounce(query, 375)
    const refetchGroups = () => {
        refetch({
            page,
            pageSize,
            query: debouncedQuery,
        })
    }

    useEffect(() => {
        refetchGroups()
    }, [page, pageSize, debouncedQuery])

    return (
        <>
            <h2>{i18n.t('User Group Management')}</h2>
            <SearchFilter value={query} onChange={setQuery} />
            <DataTableToolbar>
                <Button
                    small
                    icon={<IconAdd24 color={colors.grey600} />}
                    onClick={() => navigateTo('/user-groups/new')}
                >
                    {i18n.t('New')}
                </Button>
            </DataTableToolbar>
            <GroupTable
                loading={!called || loading}
                error={error}
                groups={data && data.groups.userGroups}
                refetch={refetchGroups}
            />
            {data && data.groups.userGroups.length > 0 && (
                <DataTableToolbar position="bottom">
                    <Pagination
                        className={styles.pagination}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        {...data.groups.pager}
                    />
                </DataTableToolbar>
            )}
        </>
    )
}

export default GroupList
