import i18n from '@dhis2/d2-i18n'
import {
    colors,
    CenteredContent,
    CircularLoader,
    NoticeBox,
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    Button,
    IconMore24,
} from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import navigateTo from '../../utils/navigateTo'
import styles from './UserTable.module.css'

const UserTable = ({ loading, error, users }) => {
    if (loading) {
        return (
            <DataTable>
                <CenteredContent className={styles.infoWrapper}>
                    <CircularLoader />
                </CenteredContent>
            </DataTable>
        )
    }

    if (error) {
        return (
            <DataTable>
                <div className={styles.infoWrapper}>
                    <NoticeBox error title={i18n.t('Error loading users')}>
                        {error.message}
                    </NoticeBox>
                </div>
            </DataTable>
        )
    }

    if (users.length === 0) {
        return (
            <DataTable>
                <p className={styles.infoWrapper}>
                    {i18n.t('No results found')}
                </p>
            </DataTable>
        )
    }

    const createCellOnClickHandler = userId => () => {
        navigateTo(`/users/edit/${userId}`)
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
                {users.map(({ id, displayName, userCredentials }) => (
                    <DataTableRow key={id}>
                        <DataTableCell onClick={createCellOnClickHandler(id)}>
                            {displayName}
                        </DataTableCell>
                        <DataTableCell onClick={createCellOnClickHandler(id)}>
                            {userCredentials.username}
                        </DataTableCell>
                        <DataTableCell onClick={createCellOnClickHandler(id)}>
                            {userCredentials.lastLogin && (
                                <span title={userCredentials.lastLogin}>
                                    {moment(
                                        userCredentials.lastLogin
                                    ).fromNow()}
                                </span>
                            )}
                        </DataTableCell>
                        <DataTableCell onClick={createCellOnClickHandler(id)}>
                            {userCredentials.disabled && i18n.t('Disabled')}
                        </DataTableCell>
                        <DataTableCell>
                            <Button
                                small
                                secondary
                                icon={<IconMore24 color={colors.grey600} />}
                            ></Button>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTableBody>
        </DataTable>
    )
}

UserTable.propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object.isRequired),
}

export default UserTable
