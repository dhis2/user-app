import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableBody,
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Checkbox,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import PendingChangesPropType from '../PendingChangesPropType.js'
import DataTableInfoWrapper from './DataTableInfoWrapper.js'
import ResultsTableRow from './ResultsTableRow.js'

const ResultsTable = ({
    columns,
    queryErrorMessage,
    loading,
    error,
    mode,
    results,
    noResultsText,
    actionLabel,
    onActionClick,
    pendingChanges,
    onPendingChangeCancel,
    isPendingChange,
    isSelected,
    onToggleSelected,
    onToggleAllSelected,
}) => {
    if (loading && !results) {
        return (
            <DataTableInfoWrapper>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && error) {
        return (
            <DataTableInfoWrapper>
                <NoticeBox error title={queryErrorMessage}>
                    {error.message}
                </NoticeBox>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && results.length === 0) {
        return (
            <DataTableInfoWrapper>
                <p>{noResultsText}</p>
            </DataTableInfoWrapper>
        )
    }

    const noneSelected = results.every(({ id }) => !isSelected(id))
    const allSelected = results.every(({ id }) => isSelected(id))
    const allPending = results.every(({ id }) => isPendingChange(id))

    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox
                            checked={allSelected || allPending}
                            indeterminate={!noneSelected && !allSelected}
                            disabled={allPending}
                            onChange={() => onToggleAllSelected(pendingChanges)}
                        />
                    </DataTableColumnHeader>
                    {columns.map((column) => (
                        <DataTableColumnHeader key={column.label}>
                            {column.label}
                        </DataTableColumnHeader>
                    ))}
                    <DataTableColumnHeader>
                        {i18n.t('Action')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody loading={loading}>
                {results.map((result) => {
                    const pendingChangeEntity = (
                        mode === 'MEMBERS'
                            ? pendingChanges.removals
                            : pendingChanges.additions
                    ).find((e) => e.id === result.id)
                    const hasPendingChange = !!pendingChangeEntity
                    const pendingChangeAction =
                        mode === 'MEMBERS' ? 'REMOVE' : 'ADD'
                    const cells = columns.map((column) =>
                        column.mapDataToValue(result)
                    )

                    return (
                        <ResultsTableRow
                            key={result.id}
                            cells={cells}
                            actionButton={
                                <Button
                                    secondary
                                    small
                                    onClick={() => onActionClick(result)}
                                    disabled={loading}
                                >
                                    {actionLabel}
                                </Button>
                            }
                            pendingChangeAction={
                                hasPendingChange
                                    ? pendingChangeAction
                                    : undefined
                            }
                            onPendingChangeCancel={() =>
                                onPendingChangeCancel(pendingChangeEntity)
                            }
                            selected={
                                isSelected(result.id) ||
                                isPendingChange(result.id)
                            }
                            onToggleSelected={() => onToggleSelected(result.id)}
                        />
                    )
                })}
            </DataTableBody>
        </DataTable>
    )
}

ResultsTable.propTypes = {
    actionLabel: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            mapDataToValue: PropTypes.func.isRequired,
        })
    ).isRequired,
    isPendingChange: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    noResultsText: PropTypes.string.isRequired,
    pendingChanges: PendingChangesPropType.isRequired,
    onActionClick: PropTypes.func.isRequired,
    onPendingChangeCancel: PropTypes.func.isRequired,
    onToggleAllSelected: PropTypes.func.isRequired,
    onToggleSelected: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    queryErrorMessage: PropTypes.string,
    results: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired
    ),
}

export default ResultsTable
