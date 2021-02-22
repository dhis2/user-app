import React from 'react'
import i18n from '@dhis2/d2-i18n'
import PropTypes from '@dhis2/prop-types'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import ErrorMessage from '../../../components/ErrorMessage'
import CircularProgress from 'material-ui/CircularProgress'
import styles from './UserList.module.css'
import FlatButton from 'material-ui/FlatButton'
import navigateTo from '../../../utils/navigateTo'

// TODO: this MUI version has a pretty buggy Table. If we first select all
// and then deselect a single item we end up with a mismatch between state and UI.
// The state will correctly have `users.length - 1` selectedUsers, but the UI will
// show everything as deselected. For now, I've simply added some logic that makes
// sure the state is equivalent to the UI. But the real fix should be the other way
// around: all but one items should be and look selected.

export default function UserList({
    users,
    loading,
    error,
    selectable,
    selectedUsers,
    setSelectedUsers,
}) {
    const selectedUsersLookup = new Set(selectedUsers)
    const headerRowClass =
        !selectable || (users && users.length === 0)
            ? styles.noCheckBox
            : undefined
    const allSelected = users && users.length === selectedUsers.length
    const onRowSelection = selectedRowIndexes => {
        let ids

        if (selectedRowIndexes === 'all') {
            ids = users.map(({ id }) => id)
        } else if (selectedRowIndexes === 'none') {
            ids = []
        } else {
            // HACK. See comment above
            ids = allSelected
                ? []
                : selectedRowIndexes.map(index => users[index].id)
        }
        setSelectedUsers(ids)
    }
    return (
        <div className={styles.container}>
            <Table
                selectable={selectable}
                multiSelectable={selectable}
                onRowSelection={onRowSelection}
            >
                <TableHeader>
                    <TableRow className={headerRowClass}>
                        <TableHeaderColumn>{i18n.t('Name')}</TableHeaderColumn>
                        <TableHeaderColumn>
                            {i18n.t('Username')}
                        </TableHeaderColumn>
                        <TableHeaderColumn />
                    </TableRow>
                </TableHeader>

                {users && (
                    <TableBody
                        deselectOnClickaway={false}
                        className={styles.tablebody}
                        displayRowCheckbox={selectable}
                    >
                        {users.map(user => (
                            <TableRow
                                selected={selectedUsersLookup.has(user.id)}
                                key={user.id}
                            >
                                <TableRowColumn>
                                    {user.displayName}
                                </TableRowColumn>
                                <TableRowColumn>{user.username}</TableRowColumn>
                                <TableRowColumn>
                                    <FlatButton
                                        label={i18n.t('Edit')}
                                        onClick={() =>
                                            navigateTo(`/users/edit/${user.id}`)
                                        }
                                    />
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            {error && (
                <ErrorMessage
                    introText={i18n.t(
                        'There was a problem retrieving the user list'
                    )}
                    errorMessage={error.message}
                />
            )}
            {loading && (
                <div className={styles.addition}>
                    <CircularProgress />
                </div>
            )}
            {users && users.length === 0 && (
                <div className={styles.addition}>
                    {i18n.t('No results found')}
                </div>
            )}
        </div>
    )
}
UserList.propTypes = {
    error: PropTypes.bool,
    loading: PropTypes.bool,
    selectable: PropTypes.bool,
    selectedUsers: PropTypes.arrayOf(PropTypes.string),
    setSelectedUsers: PropTypes.func,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string,
            id: PropTypes.string,
            username: PropTypes.string,
        })
    ),
}
