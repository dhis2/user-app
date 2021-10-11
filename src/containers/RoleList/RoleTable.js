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

const RoleTable = ({ loading, error, roles, refetch }) => {
    if (loading) {
        return (
            <DataTableInfoWrapper columns={3}>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </DataTableInfoWrapper>
        )
    }

    if (error) {
        return (
            <DataTableInfoWrapper columns={3}>
                <NoticeBox error title={i18n.t('Error loading user roles')}>
                    {error.message}
                </NoticeBox>
            </DataTableInfoWrapper>
        )
    }

    if (roles.length === 0) {
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
                    <DataTableColumnHeader>
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
            <DataTableBody>
                {roles.map(role => {
                    const { id, displayName, access, description } = role
                    const handleClick = () => {
                        if (access.update) {
                            navigateTo(`/user-roles/edit/${id}`)
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
    refetch: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.object.isRequired),
}

export default RoleTable
