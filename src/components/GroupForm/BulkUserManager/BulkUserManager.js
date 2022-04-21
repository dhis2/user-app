import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import BulkMemberManager from '../../BulkMemberManager'
import { useQueries } from './useQueries'

const renderTopBarFilterLabel = ({ mode }) =>
    mode === 'MEMBERS'
        ? i18n.t('Search for a user in this group')
        : i18n.t('Search for a user to add')

const renderTopBarSelectionText = ({ selectedCount, pagerTotal }) =>
    pagerTotal === 1
        ? i18n.t('1 of 1 user selected')
        : i18n.t('{{selectedCount}} of {{totalUsers}} users selected', {
              selectedCount,
              totalUsers: pagerTotal,
          })

const renderTopBarActionText = ({ mode, selectedCount }) =>
    mode === 'MEMBERS'
        ? selectedCount === 1
            ? i18n.t('Remove 1 user')
            : i18n.t('Remove {{selectedCount}} users', {
                  selectedCount,
              })
        : selectedCount === 1
        ? i18n.t('Add 1 user')
        : i18n.t('Add {{selectedCount}} users', {
              selectedCount,
          })

const renderRowActionLabel = ({ mode }) =>
    mode === 'MEMBERS' ? i18n.t('Remove from group') : i18n.t('Add to group')

const transformUserResults = results =>
    results.users.map(user => ({
        ...user,
        displayName: user.username || user.name,
    }))

const renderNoResultsText = ({ mode, filter }) =>
    mode === 'MEMBERS' && filter === ''
        ? i18n.t(`There aren't any users in this group yet`)
        : i18n.t('No results found')

const renderPageSummaryText = ({ firstItem, lastItem, total }) =>
    i18n.t('Users {{firstItem}}-{{lastItem}} of {{total}}', {
        firstItem,
        lastItem,
        total,
    })

const BulkUserManager = ({ className, groupId, value, onChange }) => {
    const { membersQuery, nonMembersQuery } = useQueries({ groupId })

    return (
        <BulkMemberManager
            className={className}
            canManageMembers={!!groupId}
            membersManagementLabel={i18n.t('View and remove users from group')}
            nonMembersManagementLabel={i18n.t('Add users to group')}
            topBarFilterLabel={renderTopBarFilterLabel}
            topBarSelectionText={renderTopBarSelectionText}
            topBarActionText={renderTopBarActionText}
            noResultsText={renderNoResultsText}
            columnHeaders={[i18n.t('Username'), i18n.t('Display name')]}
            renderRow={user => [user.username, user.name]}
            rowActionLabel={renderRowActionLabel}
            queryErrorMessage={i18n.t('Error loading users')}
            membersQuery={membersQuery}
            nonMembersQuery={nonMembersQuery}
            transformQueryResponse={transformUserResults}
            pageSummaryText={renderPageSummaryText}
            value={value}
            onChange={onChange}
        />
    )
}

BulkUserManager.propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    groupId: PropTypes.string,
}

export default BulkUserManager
