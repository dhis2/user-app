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
import { connect } from 'react-redux'
import DataTableInfoWrapper from '../../components/DataTableInfoWrapper'
import navigateTo from '../../utils/navigateTo'
import ContextMenuButton from './ContextMenu/ContextMenuButton'

const GroupTable = ({ loading, error, groups, refetch, currentUser }) => {
    if (loading && !groups) {
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
                <NoticeBox error title={i18n.t('Error loading user groups')}>
                    {error.message}
                </NoticeBox>
            </DataTableInfoWrapper>
        )
    }

    if (!loading && groups.length === 0) {
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
                        {i18n.t('Member?')}
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Actions')}
                    </DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody loading={loading}>
                {groups.map(group => {
                    const { id, displayName, access } = group
                    const handleClick = () => {
                        if (access.update) {
                            navigateTo(`/user-groups/edit/${id}`)
                        } else if (access.read) {
                            navigateTo(`/user-groups/view/${id}`)
                        }
                    }

                    return (
                        <DataTableRow key={id}>
                            <DataTableCell onClick={handleClick}>
                                {displayName}
                            </DataTableCell>
                            <DataTableCell onClick={handleClick}>
                                {currentUser.userGroupIds.includes(id) &&
                                    i18n.t('Member')}
                            </DataTableCell>
                            <DataTableCell>
                                <ContextMenuButton
                                    group={group}
                                    refetchGroups={refetch}
                                />
                            </DataTableCell>
                        </DataTableRow>
                    )
                })}
            </DataTableBody>
        </DataTable>
    )
}

GroupTable.propTypes = {
    currentUser: PropTypes.shape({
        userGroupIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
    refetch: PropTypes.func.isRequired,
    error: PropTypes.object,
    groups: PropTypes.arrayOf(PropTypes.object.isRequired),
    loading: PropTypes.bool,
}

const mapStateToProps = ({ currentUser }) => ({ currentUser })

export default connect(mapStateToProps)(GroupTable)
