import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection, TransferField } from '../Form.js'
import { hasSelectionValidator } from './validators.js'

const RolesSection = React.memo(
    ({ user, userRoleOptions, userGroupOptions }) => (
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
            <TransferField
                name="userGroups"
                leftHeader={i18n.t('Available user groups')}
                rightHeader={i18n.t('User groups this user is a member of')}
                options={userGroupOptions}
                initialValue={user?.userGroups.map(({ id }) => id) || []}
            />
        </FormSection>
    )
)

RolesSection.propTypes = {
    userGroupOptions: PropTypes.array.isRequired,
    userRoleOptions: PropTypes.array.isRequired,
    user: PropTypes.object,
}

export default RolesSection
