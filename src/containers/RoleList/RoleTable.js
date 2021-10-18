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
import PropTypes from 'prop-types'
import React from 'react'
import DataTableInfoWrapper from '../../components/DataTableInfoWrapper'
import navigateTo from '../../utils/navigateTo'
import ContextMenuButton from './ContextMenu/ContextMenuButton'

const RoleTable = ({
    loading,
    error,
    roles,
    refetch,
    nameSortDirection,
    onNameSortDirectionToggle,
}) => {
    if (loading && !roles) {
        return (
            <DataTableInfoWrapper columns={3}>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && error) {
        return (
            <DataTableInfoWrapper columns={3}>
                <NoticeBox error title={i18n.t('Error loading user roles')}>
                    {error.message}
                </NoticeBox>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && roles.length === 0) {
        return (
            <DataTableInfoWrapper columns={3}>
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
                        {i18n.t('Description')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Actions')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody loading={loading}>
                {roles.map(role => {
                    const { id, displayName, access, description } = role
                    const handleClick = () => {
                        if (access.update) {
                            navigateTo(`/user-roles/edit/${id}`)
                        } else if (access.read) {
                            navigateTo(`/user-roles/view/${id}`)
                        }
                    }

                    return (
                        <DataTableRow key={id}>
                            <DataTableCell onClick={handleClick}>
                                {displayName}
                            </DataTableCell>
                            <DataTableCell onClick={handleClick}>
                                {description}
                            </DataTableCell>
                            <DataTableCell>
                                <ContextMenuButton
                                    role={role}
                                    refetchRoles={refetch}
                                />
                            </DataTableCell>
                        </DataTableRow>
                    )
                })}
            </DataTableBody>
        </DataTable>
    )
}

RoleTable.propTypes = {
    nameSortDirection: PropTypes.string.isRequired,
    refetch: PropTypes.func.isRequired,
    onNameSortDirectionToggle: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    roles: PropTypes.arrayOf(
        PropTypes.shape({
            access: PropTypes.shape({
                read: PropTypes.bool.isRequired,
                update: PropTypes.bool.isRequired,
            }).isRequired,
            description: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        }).isRequired
    ),
}

export default RoleTable
