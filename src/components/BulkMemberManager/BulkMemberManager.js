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
    membersManagementLabel,
    nonMembersManagementLabel,
    topBarFilterLabel,
    topBarSelectionText,
    topBarActionText,
    noResultsText,
    queryErrorMessage,
    membersQuery,
    nonMembersQuery,
    transformQueryResponse,
    filterDebounceMs,
    columnHeaders,
    rowActionLabel,
    renderRow,
    pageSummaryText,
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
                        label: membersManagementLabel,
                        value: 'MEMBERS',
                        disabled: !canManageMembers,
                    },
                    {
                        label: nonMembersManagementLabel,
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
                            selectedResults={
                                results
                                    ? results.filter(({ id }) =>
                                          selected.has(id)
                                      )
                                    : []
                            }
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
                        noResultsText={
                            typeof noResultsText === 'function'
                                ? noResultsText({ mode, filter })
                                : noResultsText
                        }
                        actionLabel={
                            typeof rowActionLabel === 'function'
                                ? rowActionLabel({ mode })
                                : rowActionLabel
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
                                pageSummaryText={pageSummaryText}
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
    noResultsText: i18n.t('No results found'),
    columnHeaders: [i18n.t('Display name')],
    renderRow: entity => [entity.displayName],
    filterDebounceMs: 375,
    transformQueryResponse: response => response,
}

BulkMemberManager.propTypes = {
    /**
     * Label used by segmented control for member management option.
     */
    membersManagementLabel: PropTypes.string.isRequired,
    /**
     * Query for fetching members to view and/or remove.
     * Query params passed to `results` query: `({ page, filter })`
     */
    membersQuery: PropTypes.shape({
        results: PropTypes.object.isRequired,
    }).isRequired,
    /**
     * Label used by segmented control for non-member management option.
     */
    nonMembersManagementLabel: PropTypes.string.isRequired,
    /**
     * Query for fetching non-members to view and/or add.
     * Query params passed to `results` query: `({ page, filter })`
     */
    nonMembersQuery: PropTypes.shape({
        results: PropTypes.object.isRequired,
    }).isRequired,
    /**
     * Called with args `({ mode })`.
     */
    rowActionLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
        .isRequired,
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
     * Column headers for results table. Default value: `['Display name']`.
     */
    columnHeaders: PropTypes.arrayOf(PropTypes.string.isRequired),
    /**
     * Debounce (in milliseconds) applied to filter before triggering a
     * new request. Default value: `375`.
     */
    filterDebounceMs: PropTypes.number,
    /**
     * Called with args `({ mode, filter })`. Default value: `'No results found'`.
     */
    noResultsText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * See documentation for `Pagination` component's `pageSummaryText` prop.
     */
    pageSummaryText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
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
