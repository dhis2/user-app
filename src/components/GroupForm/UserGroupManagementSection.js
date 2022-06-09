import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection, TransferField } from '../Form.js'

const UserGroupManagementSection = React.memo(({ group, userGroupOptions }) => (
    <FormSection
        title={i18n.t('User group management')}
        description={i18n.t(
            'This group can manage other user groups. Add managed user groups below.'
        )}
    >
        <TransferField
            name="managedGroups"
            leftHeader={i18n.t('Available user groups')}
            rightHeader={i18n.t('Managed user groups')}
            options={userGroupOptions}
            initialValue={group?.managedGroups.map(({ id }) => id) || []}
        />
    </FormSection>
))

UserGroupManagementSection.propTypes = {
    userGroupOptions: PropTypes.array.isRequired,
    group: PropTypes.object,
}

export default UserGroupManagementSection
