import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableBody,
    DataTableCell,
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Checkbox,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import DataTableInfoWrapper from '../../../components/DataTableInfoWrapper'

const UserTable = ({
    loading,
    error,
    users,
    actionLabel,
    toggleAll,
    toggleSelected,
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
                <p>{i18n.t('No results found')}</p>
            </DataTableInfoWrapper>
        )
    }

    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    <DataTableColumnHeader width="48px">
                        <Checkbox onChange={toggleAll} />
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
                {users.map(({ id, username, firstName, surname }) => (
                    <DataTableRow key={id}>
                        <DataTableCell width="48px">
                            <Checkbox onChange={toggleSelected} value={id} />
                        </DataTableCell>
                        <DataTableCell>{username}</DataTableCell>
                        <DataTableCell>{`${firstName} ${surname}`}</DataTableCell>
                        <DataTableCell>
                            <Button secondary small>
                                {actionLabel}
                            </Button>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTableBody>
        </DataTable>
    )
}

UserTable.propTypes = {
    actionLabel: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    toggleAll: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    users: PropTypes.arrayOf(
        PropTypes.shape({
            /* eslint-disable react/sort-prop-types */
            // TODO: switch to 'name' once https://github.com/dhis2/dhis2-core/pull/9126 is merged
            // name: PropTypes.string.isRequired,
            // username: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            surname: PropTypes.string.isRequired,

            id: PropTypes.string.isRequired,
        }).isRequired
    ),
}

export default UserTable
