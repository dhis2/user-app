import i18n from '@dhis2/d2-i18n'
import { DataTableToolbar, InputField, Pagination } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './BulkUserManager.module.css'
import ModeButtons from './ModeButtons'
import PendingChanges from './PendingChanges'
import { usePendingChanges } from './usePendingChanges'
import UserTable from './UserTable'
import { useUsers } from './useUsers'

const BulkUserManager = ({ groupId }) => {
    const [mode, setMode] = useState('MEMBERS')
    const { loading, error, users, pager, setPage } = useUsers({
        groupId,
        mode,
    })
    const pendingChanges = usePendingChanges()
    const showPagination = !loading && !error && users.length > 0

    const toggleAll = () => {}
    const toggleSelected = () => {}

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Users')}</h2>
            <ModeButtons mode={mode} onModeChange={setMode} />
            <div className={styles.grid}>
                <div>
                    <DataTableToolbar>
                        <InputField
                            placeholder={
                                mode === 'MEMBERS'
                                    ? i18n.t('Search for a user in this group')
                                    : i18n.t('Search for a user to add')
                            }
                            inputWidth="300px"
                            disabled={loading || !!error}
                            dense
                        />
                    </DataTableToolbar>
                    <UserTable
                        loading={loading}
                        error={error}
                        users={users}
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
                        toggleAll={toggleAll}
                        toggleSelected={toggleSelected}
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
    groupId: PropTypes.string.isRequired,
}

export default BulkUserManager
