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
import PendingChangesPropType from '../PendingChangesPropType'
import DataTableInfoWrapper from './DataTableInfoWrapper'
import ResultsTableRow from './ResultsTableRow'

const ResultsTable = ({
    columnHeaders,
    renderRow,
    loading,
    error,
    mode,
    results,
    noResultsMessage,
    actionLabel,
    onActionClick,
    pendingChanges,
    onPendingChangeCancel,
    selected,
    onToggleSelected,
    onToggleAllSelected,
}) => {
    if (loading && !results) {
        return (
            <DataTableInfoWrapper columns={4}>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && error) {
        return (
            <DataTableInfoWrapper columns={4}>
                <NoticeBox error title={i18n.t('Error loading users')}>
                    {error.message}
                </NoticeBox>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && results.length === 0) {
        return (
            <DataTableInfoWrapper columns={4}>
                <p>{noResultsMessage}</p>
            </DataTableInfoWrapper>
        )
    }

    const selectedResults = results.filter(({ id }) => selected.has(id))

    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox
                            checked={selectedResults.length === results.length}
                            indeterminate={
                                selectedResults.length > 0 &&
                                selectedResults.length < results.length
                            }
                            onChange={onToggleAllSelected}
                            disabled={loading}
                        />
                    </DataTableColumnHeader>
                    {columnHeaders.map(header => (
                        <DataTableColumnHeader key={header}>
                            {header}
                        </DataTableColumnHeader>
                    ))}
                    <DataTableColumnHeader>
                        {i18n.t('Action')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody loading={loading}>
                {results.map(result => {
                    const pendingChangeEntity = (
                        mode === 'MEMBERS'
                            ? pendingChanges.removals
                            : pendingChanges.additions
                    ).find(e => e.id === result.id)
                    const hasPendingChange = !!pendingChangeEntity
                    const pendingChangeAction =
                        mode === 'MEMBERS' ? 'REMOVE' : 'ADD'

                    return (
                        <ResultsTableRow
                            key={result.id}
                            cells={renderRow(result)}
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
                            selected={selected.has(result.id)}
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
    columnHeaders: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    loading: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    noResultsMessage: PropTypes.string.isRequired,
    pendingChanges: PendingChangesPropType.isRequired,
    renderRow: PropTypes.func.isRequired,
    selected: PropTypes.shape({
        has: PropTypes.func.isRequired,
    }).isRequired,
    onActionClick: PropTypes.func.isRequired,
    onPendingChangeCancel: PropTypes.func.isRequired,
    onToggleAllSelected: PropTypes.func.isRequired,
    onToggleSelected: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    results: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired
    ),
}

export default ResultsTable
