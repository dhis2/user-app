import i18n from '@dhis2/d2-i18n'
import { IconChevronDown24, IconChevronUp24, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSystemInformation } from '../../providers/index.js'
import styles from './AssignmentRestrictionsWarning.module.css'

export const AssignmentRestrictionWarning = ({
    currentUser,
    roleId,
    roleAuthorities,
    initiallyExpanded,
}) => {
    const [detailsExpanded, setDetailsExpanded] = useState(
        initiallyExpanded ?? false
    )

    // check if user is able to assign this role if they are a member
    const {
        userRoleIds,
        authorities: userAuthorities,
        hasAllAuthority,
    } = currentUser
    const { usersCanAssignOwnUserRoles, authorityIdToNameMap } =
        useSystemInformation()
    const cannotAssignThisRole =
        !hasAllAuthority &&
        !usersCanAssignOwnUserRoles &&
        userRoleIds.includes(roleId)

    // check if role has authorities that user does not have
    const missingAutoritiesForUser = hasAllAuthority
        ? []
        : roleAuthorities.filter(
              (roleAuth) => !userAuthorities.includes(roleAuth)
          )

    if (!cannotAssignThisRole && missingAutoritiesForUser.length === 0) {
        return null
    }

    return (
        <NoticeBox className={styles.noticeBox}>
            {cannotAssignThisRole && (
                <div>
                    {i18n.t(
                        'You cannot assign this role because you are assigned to this role, and your system does not allow you to assign roles of which you are a member.'
                    )}
                </div>
            )}
            {missingAutoritiesForUser?.length > 0 && (
                <div>
                    <div className={styles.missingRolesMessage}>
                        <span>
                            {i18n.t(
                                'You cannot assign this role because it has authorities that you do not have.'
                            )}
                        </span>
                        <div
                            onClick={() => {
                                setDetailsExpanded((prev) => !prev)
                            }}
                            data-test="roles-details-expand"
                        >
                            {detailsExpanded ? (
                                <IconChevronUp24 />
                            ) : (
                                <IconChevronDown24 />
                            )}
                        </div>
                    </div>

                    {detailsExpanded && (
                        <ul data-test="authorities-user-does-not-have-list">
                            {missingAutoritiesForUser
                                .sort((a, b) =>
                                    (
                                        authorityIdToNameMap.get(a) ?? a
                                    ).localeCompare(
                                        authorityIdToNameMap.get(b) ?? b
                                    )
                                )
                                .map((auth) => (
                                    <li key={auth}>
                                        {authorityIdToNameMap.get(auth) ?? auth}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            )}
        </NoticeBox>
    )
}

AssignmentRestrictionWarning.propTypes = {
    roleId: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
    initiallyExpanded: PropTypes.bool,
    roleAuthorities: PropTypes.arrayOf(PropTypes.string),
}
