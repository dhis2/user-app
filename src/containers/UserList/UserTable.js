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
import navigateTo from '../../utils/navigateTo'
import ContextMenuButton from './ContextMenu/ContextMenuButton'
import styles from './UserTable.module.css'

const InfoWrapper = ({ children }) => (
    <DataTable>
        <DataTableBody>
            <DataTableRow>
                <DataTableCell colSpan="5">
                    <div className={styles.infoWrapper}>{children}</div>
                </DataTableCell>
            </DataTableRow>
        </DataTableBody>
    </DataTable>
)

InfoWrapper.propTypes = {
    children: PropTypes.node.isRequired,
}

const UserTable = ({ loading, error, users, refetch }) => {
    if (loading) {
        return (
            <InfoWrapper>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </InfoWrapper>
        )
    }

    if (error) {
        return (
            <InfoWrapper>
                <NoticeBox error title={i18n.t('Error loading users')}>
                    {error.message}
                </NoticeBox>
            </InfoWrapper>
        )
    }

    if (users.length === 0) {
        return (
            <InfoWrapper>
                <p>{i18n.t('No results found')}</p>
            </InfoWrapper>
        )
    }

    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableColumnHeader>
                        {i18n.t('Display name')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Username')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Last login')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Account disabled?')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Actions')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                {users.map(user => {
                    const { id, displayName, access, userCredentials } = user
                    const { username, lastLogin, disabled } = userCredentials
                    const handleClick = () => {
                        if (access.update) {
                            navigateTo(`/users/edit/${id}`)
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
                                {disabled && i18n.t('Disabled')}
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
    refetch: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object.isRequired),
}

export default UserTable
