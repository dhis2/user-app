import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
} from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import DataTableInfoWrapper from '../../components/DataTableInfoWrapper.js'
import navigateTo from '../../utils/navigateTo.js'
import ContextMenuButton from './ContextMenu/ContextMenuButton.js'

const UserTable = ({
    loading,
    error,
    users,
    refetch,
    nameSortDirection,
    onNameSortDirectionToggle,
}) => {
    if (loading && !users) {
        return (
            <DataTableInfoWrapper columns={5}>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && error) {
        return (
            <DataTableInfoWrapper columns={5}>
                <NoticeBox error title={i18n.t('Error loading users')}>
                    {error.message}
                </NoticeBox>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && users.length === 0) {
        return (
            <DataTableInfoWrapper columns={5}>
                <p>{i18n.t('No results found')}</p>
            </DataTableInfoWrapper>
        )
    }

    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableColumnHeader
                        sortDirection={nameSortDirection}
                        onSortIconClick={onNameSortDirectionToggle}
                    >
                        {i18n.t('Display name')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Username')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Last login')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Status')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Actions')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody loading={loading}>
                {users.map((user) => {
                    const { id, displayName, access, userCredentials } = user
                    const { username, lastLogin, disabled } = userCredentials
                    const handleClick = () => {
                        if (access.update) {
                            navigateTo(`/users/edit/${id}`)
                        } else if (access.read) {
                            navigateTo(`/users/view/${id}`)
                        }
                    }

                    return (
                        <DataTableRow key={id}>
                            <DataTableCell onClick={handleClick}>
                                {displayName}
                            </DataTableCell>
                            <DataTableCell onClick={handleClick}>
                                {username}
                            </DataTableCell>
                            <DataTableCell onClick={handleClick}>
                                {lastLogin && (
                                    <span title={lastLogin}>
                                        {moment(lastLogin).fromNow()}
                                    </span>
                                )}
                            </DataTableCell>
                            <DataTableCell onClick={handleClick}>
                                {disabled
                                    ? i18n.t('Disabled')
                                    : i18n.t('Active')}
                            </DataTableCell>
                            <DataTableCell>
                                <ContextMenuButton
                                    user={user}
                                    refetchUsers={refetch}
                                />
                            </DataTableCell>
                        </DataTableRow>
                    )
                })}
            </DataTableBody>
        </DataTable>
    )
}

UserTable.propTypes = {
    nameSortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
    refetch: PropTypes.func.isRequired,
    onNameSortDirectionToggle: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    loading: PropTypes.bool,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            access: PropTypes.shape({
                read: PropTypes.bool.isRequired,
                update: PropTypes.bool.isRequired,
            }).isRequired,
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            userCredentials: PropTypes.shape({
                disabled: PropTypes.bool.isRequired,
                lastLogin: PropTypes.string,
                username: PropTypes.string,
            }).isRequired,
        }).isRequired
    ),
}

export default UserTable
