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
import styles from './RoleList.module.css'
import RoleTable from './RoleTable.js'
import { useFilters } from './useFilters.js'

const rolesQuery = {
    roles: {
        resource: 'userRoles',
        params: ({ page, pageSize, query, nameSortDirection }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'user[id,displayName]',
                'publicAccess',
                'userGroupAccesses',
                'description',
            ],
            order: `name:${nameSortDirection}`,
            page,
            pageSize,
            // Passing empty query modifies sorting behaviour
            query: query === '' ? undefined : query,
        }),
    },
}

const RoleList = () => {
    const { called, loading, error, data, refetch } = useDataQuery(rolesQuery, {
        lazy: true,
    })
    const roles = data?.roles
    const [prevRoles, setPrevRoles] = useState()
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
    const refetchRoles = () => {
        setPrevRoles(roles)
        refetch({
            page,
            pageSize,
            query: debouncedQuery,
            nameSortDirection,
        })
    }

    useEffect(() => {
        refetchRoles()
    }, [page, pageSize, debouncedQuery, nameSortDirection])

    return (
        <>
            <h2 className={styles.header}>{i18n.t('User Role Management')}</h2>
            <SearchFilter value={query} onChange={setQuery} />
            <DataTableToolbar>
                <Button
                    small
                    icon={<IconAdd24 color={colors.grey600} />}
                    onClick={() => navigateTo('/user-roles/new')}
                >
                    {i18n.t('New')}
                </Button>
            </DataTableToolbar>
            <RoleTable
                loading={!called || loading}
                error={error}
                roles={roles?.userRoles || prevRoles?.userRoles}
                refetch={refetchRoles}
                nameSortDirection={nameSortDirection}
                onNameSortDirectionToggle={toggleNameSortDirection}
            />
            {(loading
                ? prevRoles?.userRoles.length > 0
                : roles?.userRoles.length > 0) && (
                <DataTableToolbar position="bottom">
                    <Pagination
                        className={styles.pagination}
                        {...(loading ? prevRoles.pager : roles.pager)}
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

export default RoleList
