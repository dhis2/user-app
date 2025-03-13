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
import PageHeader from '../../components/PageHeader.jsx'
import { useFeatureToggle } from '../../hooks/useFeatureToggle.js'
import navigateTo from '../../utils/navigateTo.js'
import Filters from './Filters.jsx'
import { useFilters } from './useFilters.js'
import styles from './UserList.module.css'
import UserTable from './UserTable.jsx'

const getUsersQueryFilters = ({
    organisationUnits,
    emailVerificationStatus,
    displayEmailVerifiedStatus,
}) => {
    const organisationUnitsFilter =
        organisationUnits.length > 0
            ? `organisationUnits.id:in:[${organisationUnits.map(
                  ({ id }) => id
              )}]`
            : undefined
    // email verification filter is ignored if feature is not accessible
    const emailVerificationFilter =
        !displayEmailVerifiedStatus ||
        !['true', 'false'].includes(emailVerificationStatus)
            ? undefined
            : `emailVerified:eq:${emailVerificationStatus}`

    if (
        organisationUnitsFilter === undefined &&
        emailVerificationFilter === undefined
    ) {
        return undefined
    }
    return [organisationUnitsFilter, emailVerificationFilter]
        .filter((f) => f)
        .join(',')
}

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
            organisationUnits,
            emailVerificationStatus,
            displayEmailVerifiedStatus,
        }) => ({
            fields: [
                'id',
                'displayName',
                'access',
                'email',
                'emailVerified',
                'twoFactorEnabled',
                'username',
                'disabled',
                'lastLogin',
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
            filter: getUsersQueryFilters({
                organisationUnits,
                emailVerificationStatus,
                displayEmailVerifiedStatus,
            }),
        }),
    },
}

const UserList = () => {
    const { called, loading, error, data, refetch } = useDataQuery(usersQuery, {
        lazy: true,
    })
    const users = data?.users
    const [prevUsers, setPrevUsers] = useState()
    const {
        page,
        setPage,
        pageSize,
        setPageSize,
        query,
        setQuery,
        inactiveMonths,
        setInactiveMonths,
        invitationStatus,
        setInvitationStatus,
        selfRegistered,
        setSelfRegistered,
        nameSortDirection,
        toggleNameSortDirection,
        organisationUnits,
        setOrganisationUnits,
        emailVerificationStatus,
        setEmailVerificationStatus,
        clearFilters,
    } = useFilters()
    const [debouncedQuery] = useDebounce(query, 375)
    const { displayEmailVerifiedStatus } = useFeatureToggle()
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
            organisationUnits,
            emailVerificationStatus,
            displayEmailVerifiedStatus,
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
        JSON.stringify(organisationUnits),
        emailVerificationStatus,
        displayEmailVerifiedStatus,
    ])

    return (
        <>
            <PageHeader>{i18n.t('User Management')}</PageHeader>
            <Filters
                query={query}
                onQueryChange={setQuery}
                inactiveMonths={inactiveMonths}
                onInactiveMonthsChange={setInactiveMonths}
                invitationStatus={invitationStatus}
                onInvitationStatusChange={setInvitationStatus}
                selfRegistered={selfRegistered}
                onSelfRegisteredChange={setSelfRegistered}
                organisationUnits={organisationUnits}
                onOrganisationUnitsChange={setOrganisationUnits}
                emailVerificationStatus={emailVerificationStatus}
                onEmailVerificationStatusChange={setEmailVerificationStatus}
                onClear={clearFilters}
                displayEmailVerifiedStatus={displayEmailVerifiedStatus}
            />
            <div className={styles.container}>
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
                    users={users?.users || prevUsers?.users}
                    refetch={refetchUsers}
                    nameSortDirection={nameSortDirection}
                    onNameSortDirectionToggle={toggleNameSortDirection}
                    displayEmailVerifiedStatus={displayEmailVerifiedStatus}
                />
                {(loading
                    ? prevUsers?.users.length > 0
                    : users?.users.length > 0) && (
                    <DataTableToolbar position="bottom">
                        <Pagination
                            className={styles.pagination}
                            {...(loading ? prevUsers.pager : users.pager)}
                            page={page}
                            onPageChange={setPage}
                            pageSize={pageSize}
                            onPageSizeChange={setPageSize}
                        />
                    </DataTableToolbar>
                )}
            </div>
        </>
    )
}

export default UserList
