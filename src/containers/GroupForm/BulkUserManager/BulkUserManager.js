import i18n from '@dhis2/d2-i18n'
import { DataTableToolbar, InputField, Pagination } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './BulkUserManager.module.css'
import PendingChanges from './PendingChanges'
import UserTable from './UserTable'
import { useUsers } from './useUsers'

const BulkUserManager = ({ groupId }) => {
    const [mode, setMode] = useState('MEMBERS')
    const { loading, error, users, prevUsers, pager, setPage } = useUsers({
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
                        actionLabel={
                            mode === 'MEMBERS'
                                ? i18n.t('Remove from group')
                                : i18n.t('Add to group')
                        }
                        loading={loading}
                        error={error}
                        users={users || prevUsers}
                        toggleAll={toggleAll}
                        toggleSelected={toggleSelected}
                    />
                    <DataTableToolbar position="bottom">
                        {(loading
                            ? prevUsers?.length > 0
                            : users?.length > 0) && (
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
                        )}
                    </DataTableToolbar>
                </div>
                <PendingChanges />
            </div>
        </div>
    )
}

BulkUserManager.propTypes = {
    groupId: PropTypes.string.isRequired,
}

export default BulkUserManager
