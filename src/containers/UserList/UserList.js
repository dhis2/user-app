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
// import {
//     userContextMenuActions,
//     userContextMenuIcons,
//     isUserContextActionAllowed,
// } from './UserContextMenuActions'
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
        }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'userCredentials[username,disabled,lastLogin,twoFA]',
                'teiSearchOrganisationUnits[id,path]',
            ],
            order: ['firstName:asc', 'surname:asc'],
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

/**
 * Container component that renders a List component with correct properties for displaying a list of Users
 * @class
 */
const UserList = () => {
    const { called, loading, error, data, refetch } = useDataQuery(usersQuery, {
        lazy: true,
    })
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebounce(query, 375)
    const [inactiveMonths, setInactiveMonths] = useState()
    const [invitationStatus, setInvitationStatus] = useState()
    const [selfRegistered, setSelfRegistered] = useState(false)

    useEffect(() => {
        refetch({
            page,
            pageSize,
            query: debouncedQuery,
            inactiveMonths,
            invitationStatus,
            selfRegistered,
        })
    }, [
        page,
        pageSize,
        debouncedQuery,
        inactiveMonths,
        invitationStatus,
        selfRegistered,
    ])

    const handleFiltersClear = () => {
        setQuery('')
        setInactiveMonths()
        setInvitationStatus()
    }

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
                users={data && data.users.users}
            />
            {data && data.users.users.length > 0 && (
                <DataTableToolbar position="bottom">
                    <Pagination
                        className={styles.pagination}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        {...data.users.pager}
                    />
                </DataTableToolbar>
            )}
        </>
    )
}

export default UserList
