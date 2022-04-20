import i18n from '@dhis2/d2-i18n'
import { DataTableToolbar, Pagination, SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './BulkMemberManager.module.css'
import { useResults } from './hooks/useResults'
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

const BulkMemberManager = ({
    canManageMembers,
    topBarFilterLabel,
    topBarSelectionText,
    topBarActionText,
    queryErrorMessage,
    membersQuery,
    nonMembersQuery,
    transformQueryResponse,
    filterDebounceMs,
    columnHeaders,
    renderRow,
    value: pendingChanges,
    onChange,
}) => {
    const [mode, setMode] = useState(
        canManageMembers ? 'MEMBERS' : 'NON_MEMBERS'
    )
    const {
        loading,
        error,
        results,
        pager,
        setPage,
        selected,
        toggleSelected,
        toggleAllSelected,
        filter,
        setFilter,
    } = useResults({
        membersQuery,
        nonMembersQuery,
        transformQueryResponse,
        filterDebounceMs,
        mode,
    })
    const showPagination = !loading && !error && results.length > 0

    return (
        <div className={styles.container}>
            <SegmentedControl
                selected={mode}
                options={[
                    {
                        label: i18n.t('View and remove users from group'),
                        value: 'MEMBERS',
                        disabled: !canManageMembers,
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
                            filterLabel={topBarFilterLabel}
                            selectionText={topBarSelectionText}
                            actionText={topBarActionText}
                            mode={mode}
                            loading={loading}
                            filter={filter}
                            onFilterChange={setFilter}
                            selectedUsers={(results || []).filter(({ id }) =>
                                selected.has(id)
                            )}
                            pagerTotal={pager.total}
                            pendingChanges={pendingChanges}
                            onChange={onChange}
                        />
                    </DataTableToolbar>
                    <ResultsTable
                        columnHeaders={columnHeaders}
                        renderRow={renderRow}
                        queryErrorMessage={queryErrorMessage}
                        loading={loading}
                        error={error}
                        mode={mode}
                        results={results}
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
                    />
                </div>
            </div>
        </div>
    )
}

BulkMemberManager.defaultProps = {
    canManageMembers: true,
    columnHeaders: [i18n.t('Display name')],
    renderRow: entity => [entity.displayName],
    filterDebounceMs: 375,
    transformQueryResponse: response => response,
}

BulkMemberManager.propTypes = {
    /**
     * Query for fetching members to view and/or remove.
     * Query params passed to `results` query: `({ page, filter })`
     */
    membersQuery: PropTypes.shape({
        results: PropTypes.object.isRequired,
    }).isRequired,
    /**
     * Query for fetching non-members to view and/or add.
     * Query params passed to `results` query: `({ page, filter })`
     */
    nonMembersQuery: PropTypes.shape({
        results: PropTypes.object.isRequired,
    }).isRequired,
    /**
     * Current pending changes.
     */
    value: PendingChangesPropType.isRequired,
    /**
     * Called with arg `(newValue)`
     */
    onChange: PropTypes.func.isRequired,
    /**
     * The collection that is being manipulated has been persisted and so has
     * existing members to manage. Default value: `true`.
     */
    canManageMembers: PropTypes.bool,
    /**
     * Column headers for results table. Default value of `['Display name']`.
     */
    columnHeaders: PropTypes.arrayOf(PropTypes.string.isRequired),
    /**
     * Debounce (in milliseconds) applied to filter before triggering a
     * new request. Default value of 375ms.
     */
    filterDebounceMs: PropTypes.number,
    /**
     * Message shown to user if members/non-members query fails.
     */
    queryErrorMessage: PropTypes.string,
    /**
     * Called with arg `(entity)`. Returns an array containing the
     * contents of each column for the particular row.
     */
    renderRow: PropTypes.func,
    /**
     * Called with args `({ mode, selectedCount })`.
     */
    topBarActionText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * Called with args `({ mode })`.
     */
    topBarFilterLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * Called with args `({ selectedCount, pagerTotal })`.
     */
    topBarSelectionText: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
    /**
     * Callback to transform the response from the data queries.
     * Shape of return value: `{ id: string, displayName: string }[]`
     */
    transformQueryResponse: PropTypes.func,
}

export default BulkMemberManager
