import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import BulkMemberManager from '../../BulkMemberManager'
import { useQueries } from './useQueries'

const transformUserResults = results =>
    results.users.map(user => ({
        ...user,
        displayName: user.username,
    }))

const BulkUserManager = ({ groupId, value, onChange }) => {
    const { membersQuery, nonMembersQuery } = useQueries({ groupId })

    return (
        <BulkMemberManager
            canManageMembers={!!groupId}
            columnHeaders={[i18n.t('Username'), i18n.t('Display name')]}
            renderRow={user => [user.username, user.name]}
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
