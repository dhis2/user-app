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
import SearchFilter from '../../components/SearchFilter.js'
import navigateTo from '../../utils/navigateTo.js'
import styles from './GroupList.module.css'
import GroupTable from './GroupTable.js'
import { useFilters } from './useFilters.js'

const groupsQuery = {
    groups: {
        resource: 'userGroups',
        params: ({ page, pageSize, query, nameSortDirection }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'user[id,displayName]',
                'publicAccess',
                'userGroupAccesses',
            ],
            order: `name:${nameSortDirection}`,
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
    const groups = data?.groups
    const [prevGroups, setPrevGroups] = useState()
    const {
        page,
        setPage,
        pageSize,
        setPageSize,
        query,
        setQuery,
        nameSortDirection,
        toggleNameSortDirection,
    } = useFilters()
    const [debouncedQuery] = useDebounce(query, 375)
    const refetchGroups = () => {
        setPrevGroups(groups)
        refetch({
            page,
            pageSize,
            query: debouncedQuery,
            nameSortDirection,
        })
    }

    useEffect(() => {
        refetchGroups()
    }, [page, pageSize, debouncedQuery, nameSortDirection])

    return (
        <>
            <h2 className={styles.header}>{i18n.t('User Group Management')}</h2>
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
                groups={groups?.userGroups || prevGroups?.userGroups}
                refetch={refetchGroups}
                nameSortDirection={nameSortDirection}
                onNameSortDirectionToggle={toggleNameSortDirection}
            />
            {(loading
                ? prevGroups?.userGroups.length > 0
                : groups?.userGroups.length > 0) && (
                <DataTableToolbar position="bottom">
                    <Pagination
                        className={styles.pagination}
                        {...(loading ? prevGroups.pager : groups.pager)}
                        page={page}
                        onPageChange={setPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                    />
                </DataTableToolbar>
            )}
        </>
    )
}

export default GroupList
