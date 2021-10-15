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
import styles from './RoleList.module.css'
import RoleTable from './RoleTable'
import { useFilters } from './useFilters'

const rolesQuery = {
    roles: {
        resource: 'userRoles',
        params: ({ page, pageSize, query }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'user[id,displayName]',
                'publicAccess',
                'userGroupAccesses',
                'description',
            ],
            order: 'name:asc',
            page,
            pageSize,
            query,
        }),
    },
}

const RoleList = () => {
    const { called, loading, error, data, refetch } = useDataQuery(rolesQuery, {
        lazy: true,
    })
    const roles = data?.roles
    const [prevRoles, setPrevRoles] = useState()
    const { page, setPage, pageSize, setPageSize, query, setQuery } =
        useFilters()
    const [debouncedQuery] = useDebounce(query, 375)
    const refetchRoles = () => {
        setPrevRoles(roles)
        refetch({
            page,
            pageSize,
            query: debouncedQuery,
        })
    }

    useEffect(() => {
        refetchRoles()
    }, [page, pageSize, debouncedQuery])

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
