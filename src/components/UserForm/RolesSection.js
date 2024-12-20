import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { FormSection, TransferField } from '../Form.js'
import { hasSelectionValidator } from './validators.js'

const RolesSection = React.memo(
    ({ user, userRoleOptions, userGroupOptions, userRolesHidden }) => (
        <FormSection
            title={i18n.t('Roles and groups')}
            description={i18n.t(
                'Manage what roles and groups this user is a member of.'
            )}
        >
            <TransferField
                required
                name="userRoles"
                leftHeader={i18n.t('Available user roles')}
                rightHeader={i18n.t('User roles this user is assigned')}
                options={userRoleOptions}
                initialValue={user?.userRoles?.map(({ id }) => id) || []}
                validate={hasSelectionValidator}
            />
            <div style={{ marginBlock: '8px', width: '690px' }}>
                {userRolesHidden?.length > 0 && (
                    <NoticeBox
                        title={i18n.t(
                            'You do not have permission to assign certain user roles'
                        )}
                    >
                        <ul>
                            {userRolesHidden.map((role) => (
                                <li key={`view_details_${role.id}`}>
                                    <Link
                                        to={`/user-roles/view/${role.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span>{role.displayName}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </NoticeBox>
                )}
            </div>
            <TransferField
                name="userGroups"
                leftHeader={i18n.t('Available user groups')}
                rightHeader={i18n.t('User groups this user is a member of')}
                options={userGroupOptions}
                initialValue={user?.userGroups?.map(({ id }) => id) || []}
            />
        </FormSection>
    )
)

RolesSection.propTypes = {
    userGroupOptions: PropTypes.array.isRequired,
    userRoleOptions: PropTypes.array.isRequired,
    user: PropTypes.object,
    userRolesHidden: PropTypes.array,
}

export default RolesSection
