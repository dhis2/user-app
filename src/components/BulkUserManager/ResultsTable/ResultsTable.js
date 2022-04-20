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
    loading,
    error,
    mode,
    users,
    noResultsMessage,
    actionLabel,
    onActionClick,
    pendingChanges,
    onPendingChangeCancel,
    selected,
    onToggleSelected,
    onToggleAllSelected,
}) => {
    if (loading && !users) {
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

    if (!loading && users.length === 0) {
        return (
            <DataTableInfoWrapper columns={4}>
                <p>{noResultsMessage}</p>
            </DataTableInfoWrapper>
        )
    }

    const selectedUsers = users.filter(({ id }) => selected.has(id))

    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox
                            checked={selectedUsers.length === users.length}
                            indeterminate={
                                selectedUsers.length > 0 &&
                                selectedUsers.length < users.length
                            }
                            onChange={onToggleAllSelected}
                            disabled={loading}
                        />
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Username')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Display name')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Action')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody loading={loading}>
                {users.map(user => {
                    const pendingChangeEntity = (
                        mode === 'MEMBERS'
                            ? pendingChanges.removals
                            : pendingChanges.additions
                    ).find(e => e.id === user.id)
                    const hasPendingChange = !!pendingChangeEntity
                    const pendingChangeAction =
                        mode === 'MEMBERS' ? 'REMOVE' : 'ADD'

                    return (
                        <ResultsTableRow
                            key={user.id}
                            user={user}
                            actionButton={
                                <Button
                                    secondary
                                    small
                                    onClick={() => onActionClick(user)}
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
                            selected={selected.has(user.id)}
                            onToggleSelected={() => onToggleSelected(user.id)}
                        />
                    )
                })}
            </DataTableBody>
        </DataTable>
    )
}

ResultsTable.propTypes = {
    actionLabel: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    noResultsMessage: PropTypes.string.isRequired,
    pendingChanges: PendingChangesPropType.isRequired,
    selected: PropTypes.shape({
        has: PropTypes.func.isRequired,
    }).isRequired,
    onActionClick: PropTypes.func.isRequired,
    onPendingChangeCancel: PropTypes.func.isRequired,
    onToggleAllSelected: PropTypes.func.isRequired,
    onToggleSelected: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired
    ),
}

export default ResultsTable
