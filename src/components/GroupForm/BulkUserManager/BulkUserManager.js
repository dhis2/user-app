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

const transformUserResults = results =>
    results.users.map(user => ({
        ...user,
        displayName: user.username || user.name,
    }))

const BulkUserManager = ({ groupId, value, onChange }) => {
    const { membersQuery, nonMembersQuery } = useQueries({ groupId })

    return (
        <BulkMemberManager
            canManageMembers={!!groupId}
            topBarFilterLabel={renderTopBarFilterLabel}
            topBarSelectionText={renderTopBarSelectionText}
            topBarActionText={renderTopBarActionText}
            columnHeaders={[i18n.t('Username'), i18n.t('Display name')]}
            renderRow={user => [user.username, user.name]}
            queryErrorMessage={i18n.t('Error loading users')}
            membersQuery={membersQuery}
            nonMembersQuery={nonMembersQuery}
            transformQueryResponse={transformUserResults}
            value={value}
            onChange={onChange}
        />
    )
}

BulkUserManager.propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    groupId: PropTypes.string,
}

export default BulkUserManager
