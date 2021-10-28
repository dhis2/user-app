import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useEffect } from 'react'
import styles from './BulkUserManager.module.css'
import PendingChanges from './PendingChanges'
import UsersTable from './UsersTable'

const useUsers = ({ groupId, mode }) => {
    // Use useMemo to silence warnings from useDataQuery about dynamic queries
    const queries = useMemo(() => {
        const resource = `userGroups/${groupId}/users/gist`
        const params = {
            fields: [
                'id',
                'username',
                // TODO: switch to 'name' once https://github.com/dhis2/dhis2-core/pull/9126 is merged
                'firstName',
                'surname',
            ],
            total: true,
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
    const [membersPage, setMembersPage] = useState(1)
    const [nonMembersPage, setNonMembersPage] = useState(1)
    const membersDataQuery = useDataQuery(queries.members, { lazy: true })
    const nonMembersDataQuery = useDataQuery(queries.nonMembers, { lazy: true })

    useEffect(() => {
        if (mode === 'MEMBERS') {
            membersDataQuery.refetch({ page: membersPage })
        } else {
            nonMembersDataQuery.refetch({ page: nonMembersPage })
        }
    }, [mode, membersPage, nonMembersPage])

    const { loading, error, data } =
        mode === 'MEMBERS' ? membersDataQuery : nonMembersDataQuery
    const [page, setPage] =
        mode === 'MEMBERS'
            ? [membersPage, setMembersPage]
            : [nonMembersPage, setNonMembersPage]

    return {
        loading,
        error,
        // TODO: remove map once https://github.com/dhis2/dhis2-core/pull/9126 is merged
        users: data?.users.users.map(({ id, firstName, surname }) => ({
            id,
            name: `${firstName} ${surname}`,
        })),
        pager: {
            ...data?.users.pager,
            page,
        },
        setPage,
    }
}

const BulkUserManager = ({ groupId }) => {
    const [mode, setMode] = useState('MEMBERS')
    const { loading, error, users, pager, setPage } = useUsers({
        groupId,
        mode,
    })

    const toggleAll = () => {}
    const toggleSelected = () => {}

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Users')}</h2>
            <div className={styles.modeButtons}>
                <button
                    type="button"
                    className={
                        mode === 'MEMBERS'
                            ? styles.selectedModeButton
                            : styles.modeButton
                    }
                    onClick={() => setMode('MEMBERS')}
                >
                    {i18n.t('View and remove users from group')}
                </button>
                <button
                    type="button"
                    className={
                        mode === 'NON_MEMBERS'
                            ? styles.selectedModeButton
                            : styles.modeButton
                    }
                    onClick={() => setMode('NON_MEMBERS')}
                >
                    {i18n.t('Add users to group')}
                </button>
            </div>
            <div className={styles.grid}>
                <UsersTable
                    mode={mode}
                    users={users}
                    pager={pager}
                    onPageChange={setPage}
                    toggleAll={toggleAll}
                    toggleSelected={toggleSelected}
                />
                <PendingChanges />
            </div>
        </div>
    )
}

BulkUserManager.propTypes = {
    groupId: PropTypes.string.isRequired,
}

export default BulkUserManager
