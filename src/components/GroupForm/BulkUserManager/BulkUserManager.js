import i18n from '@dhis2/d2-i18n'
import { DataTableToolbar, Pagination, SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './BulkUserManager.module.css'
import { usePendingChanges } from './hooks/usePendingChanges'
import { useUsers } from './hooks/useUsers'
import PendingChanges from './PendingChanges'
import TopBar from './TopBar'
import UserTable from './UserTable'

const BulkUserManager = ({ groupId, onChange }) => {
    // TODO
    if (!groupId) {
        throw new Error('TODO: implement support for new groups')
    }

    const [mode, setMode] = useState('MEMBERS')
    const {
        loading,
        error,
        users,
        pager,
        setPage,
        selected,
        toggleSelected,
        toggleAllSelected,
        filter,
        setFilter,
    } = useUsers({
        groupId,
        mode,
    })
    const pendingChanges = usePendingChanges({
        onChange: () => {
            onChange(
                pendingChanges.map(({ action, userId }) => ({ action, userId }))
            )
        },
    })

    const showPagination = !loading && !error && users.length > 0

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Users')}</h2>
            <SegmentedControl
                selected={mode}
                options={[
                    {
                        label: i18n.t('View and remove users from group'),
                        value: 'MEMBERS',
                    },
                    {
                        label: i18n.t('Add users to group'),
                        value: 'NON_MEMBERS',
                    },
                ]}
                onChange={({ value }) => setMode(value)}
            />
            <div className={styles.grid}>
                <div>
                    <DataTableToolbar className={styles.topbar}>
                        <TopBar
                            mode={mode}
                            loading={loading}
                            filter={filter}
                            onFilterChange={setFilter}
                            selectedUsers={(users || []).filter(({ id }) =>
                                selected.has(id)
                            )}
                            totalUsers={pager.total}
                            pendingChanges={pendingChanges}
                        />
                    </DataTableToolbar>
                    <UserTable
                        loading={loading}
                        error={error}
                        users={users}
                        noResultsMessage={
                            mode === 'MEMBERS' && filter === ''
                                ? i18n.t(
                                      `There aren't any users in this group yet`
                                  )
                                : i18n.t('No results found')
                        }
                        actionLabel={
                            mode === 'MEMBERS'
                                ? i18n.t('Remove from group')
                                : i18n.t('Add to group')
                        }
                        onActionClick={user => {
                            if (mode === 'MEMBERS') {
                                pendingChanges.remove(user)
                            } else {
                                pendingChanges.add(user)
                            }
                        }}
                        pendingChanges={pendingChanges}
                        selected={selected}
                        onToggleSelected={toggleSelected}
                        onToggleAllSelected={toggleAllSelected}
                    />
                    {showPagination && (
                        <DataTableToolbar position="bottom">
                            <Pagination
                                className={styles.pagination}
                                {...pager}
                                onPageChange={setPage}
                                pageSummaryText={({
                                    firstItem,
                                    lastItem,
                                    total,
                                }) =>
                                    i18n.t(
                                        'Users {{firstItem}}-{{lastItem}} of {{total}}',
                                        {
                                            firstItem,
                                            lastItem,
                                            total,
                                        }
                                    )
                                }
                                hidePageSelect
                                hidePageSizeSelect
                            />
                        </DataTableToolbar>
                    )}
                </div>
                <div>
                    <PendingChanges pendingChanges={pendingChanges} />
                </div>
            </div>
        </div>
    )
}

BulkUserManager.propTypes = {
    onChange: PropTypes.func.isRequired,
    groupId: PropTypes.string,
}

export default BulkUserManager
