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
import navigateTo from '../../utils/navigateTo'
import Filters from './Filters'
import styles from './UserList.module.css'
import UserTable from './UserTable'

const usersQuery = {
    users: {
        resource: 'users',
        params: ({
            page,
            pageSize,
            query,
            inactiveMonths,
            invitationStatus,
            selfRegistered,
            nameSortDirection,
        }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'userCredentials[username,disabled,lastLogin,twoFA]',
                'teiSearchOrganisationUnits[id,path]',
            ],
            order: [
                `firstName:${nameSortDirection}`,
                `surname:${nameSortDirection}`,
            ],
            userOrgUnits: true,
            includeChildren: true,
            page,
            pageSize,
            query,
            inactiveMonths,
            invitationStatus,
            selfRegistered,
        }),
    },
}

const UserList = () => {
    const { called, loading, error, data, refetch } = useDataQuery(usersQuery, {
        lazy: true,
    })
    const users = data?.users
    const [prevUsers, setPrevUsers] = useState()
    // TODO: Store in URL query params in order to have shareable links
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebounce(query, 375)
    const [inactiveMonths, setInactiveMonths] = useState()
    const [invitationStatus, setInvitationStatus] = useState()
    const [selfRegistered, setSelfRegistered] = useState(false)
    const [nameSortDirection, setNameSortDirection] = useState('asc')
    const refetchUsers = () => {
        setPrevUsers(users)
        refetch({
            page,
            pageSize,
            query: debouncedQuery,
            inactiveMonths,
            invitationStatus,
            selfRegistered,
            nameSortDirection,
        })
    }

    useEffect(() => {
        refetchUsers()
    }, [
        page,
        pageSize,
        debouncedQuery,
        inactiveMonths,
        invitationStatus,
        selfRegistered,
        nameSortDirection,
    ])

    const handleFiltersClear = () => {
        setQuery('')
        setInactiveMonths()
        setInvitationStatus()
        setNameSortDirection('asc')
    }
    const handleNameSortDirectionToggle = () =>
        setNameSortDirection(sortDirection => {
            if (sortDirection === 'asc') {
                return 'desc'
            } else {
                return 'asc'
            }
        })

    return (
        <>
            <h2>{i18n.t('User Management')}</h2>
            <Filters
                query={query}
                onQueryChange={setQuery}
                inactiveMonths={inactiveMonths}
                onInactiveMonthsChange={setInactiveMonths}
                invitationStatus={invitationStatus}
                onInvitationStatusChange={setInvitationStatus}
                selfRegistered={selfRegistered}
                onSelfRegisteredChange={setSelfRegistered}
                onClear={handleFiltersClear}
            />
            <DataTableToolbar>
                <Button
                    small
                    icon={<IconAdd24 color={colors.grey600} />}
                    onClick={() => navigateTo('/users/new')}
                >
                    {i18n.t('New')}
                </Button>
            </DataTableToolbar>
            <UserTable
                loading={!called || loading}
                error={error}
                users={users?.users}
                prevUsers={prevUsers?.users}
                refetch={refetchUsers}
                nameSortDirection={nameSortDirection}
                onNameSortDirectionToggle={handleNameSortDirectionToggle}
            />
            {(loading
                ? prevUsers?.users.length > 0
                : users?.users.length > 0) && (
                <DataTableToolbar position="bottom">
                    <Pagination
                        className={styles.pagination}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        {...(loading ? prevUsers.pager : users.pager)}
                    />
                </DataTableToolbar>
            )}
        </>
    )
}

export default UserList
