import i18n from '@dhis2/d2-i18n'
import {
    DataTableToolbar,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableBody,
    DataTableCell,
    InputField,
    Checkbox,
    Button,
    Pagination,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const UsersTable = ({
    mode,
    users,
    pager,
    onPageChange,
    toggleAll,
    toggleSelected,
}) => (
    <div>
        <DataTableToolbar>
            <InputField
                placeholder={
                    mode === 'MEMBERS'
                        ? i18n.t('Search for a user in this group')
                        : i18n.t('Search for a user to add')
                }
                inputWidth="300px"
                dense
            />
        </DataTableToolbar>
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
            <DataTableBody>
                {users.map(({ id, username, name }) => (
                    <DataTableRow key={id}>
                        <DataTableCell width="48px">
                            <Checkbox onChange={toggleSelected} value={id} />
                        </DataTableCell>
                        <DataTableCell>{username}</DataTableCell>
                        <DataTableCell>{name}</DataTableCell>
                        <DataTableCell>
                            <Button secondary small>
                                {mode === 'MEMBERS'
                                    ? i18n.t('Remove from group')
                                    : i18n.t('Add to group')}
                            </Button>
                        </DataTableCell>
                    </DataTableRow>
                ))}
            </DataTableBody>
        </DataTable>
        <DataTableToolbar position="bottom">
            <Pagination {...pager} onPageChange={onPageChange} />
        </DataTableToolbar>
    </div>
)

UsersTable.propTypes = {
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    pager: PropTypes.shape({
        page: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
    toggleAll: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    onPageChange: PropTypes.func.isRequired,
}

export default UsersTable
