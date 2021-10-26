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
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const UsersTable = ({ mode, toggleAll, toggleSelected }) => (
    <div>
        <DataTableToolbar>
            <InputField
                placeholder={
                    mode === 'VIEW_AND_REMOVE'
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
                <DataTableRow>
                    <DataTableCell width="48px">
                        <Checkbox onChange={toggleSelected} value="user-1" />
                    </DataTableCell>
                    <DataTableCell>Some username</DataTableCell>
                    <DataTableCell>Some display name</DataTableCell>
                    <DataTableCell>
                        <Button secondary small>
                            {mode === 'VIEW_AND_REMOVE'
                                ? i18n.t('Remove from group')
                                : i18n.t('Add to group')}
                        </Button>
                    </DataTableCell>
                </DataTableRow>
            </DataTableBody>
        </DataTable>
        <DataTableToolbar position="bottom">
            Pagination goes here
        </DataTableToolbar>
    </div>
)

UsersTable.propTypes = {
    mode: PropTypes.oneOf(['VIEW_AND_REMOVE', 'ADD']).isRequired,
    toggleAll: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
}

export default UsersTable
