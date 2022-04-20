import i18n from '@dhis2/d2-i18n'
import { DataTableToolbar, Pagination, SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './BulkUserManager.module.css'
import { useUsers } from './hooks/useUsers'
import PendingChanges from './PendingChanges'
import {
    addEntity,
    removeEntity,
    cancelAddEntity,
    cancelRemoveEntity,
} from './pendingChangesActions'
import PendingChangesPropType from './PendingChangesPropType'
import ResultsTable from './ResultsTable'
import TopBar from './TopBar'

const BulkUserManager = ({ groupId, value: pendingChanges, onChange }) => {
    const [mode, setMode] = useState(groupId ? 'MEMBERS' : 'NON_MEMBERS')
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
                        disabled: !groupId,
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
                            onChange={onChange}
                        />
                    </DataTableToolbar>
                    <ResultsTable
                        loading={loading}
                        error={error}
                        mode={mode}
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
                        onActionClick={entity => {
                            onChange(
                                mode === 'MEMBERS'
                                    ? removeEntity(pendingChanges, entity)
                                    : addEntity(pendingChanges, entity)
                            )
                        }}
                        pendingChanges={pendingChanges}
                        onPendingChangeCancel={entity => {
                            onChange(
                                mode === 'MEMBERS'
                                    ? cancelRemoveEntity(pendingChanges, entity)
                                    : cancelAddEntity(pendingChanges, entity)
                            )
                        }}
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
                    <PendingChanges
                        pendingChanges={pendingChanges}
                        onChange={onChange}
                        renderPendingChange={entity => entity.username}
                    />
                </div>
            </div>
        </div>
    )
}

BulkUserManager.propTypes = {
    value: PendingChangesPropType.isRequired,
    onChange: PropTypes.func.isRequired,
    groupId: PropTypes.string,
}

export default BulkUserManager
