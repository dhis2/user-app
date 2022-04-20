import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection } from '../Form'
import BulkUserManagerField from './BulkUserManager/BulkUserManagerField'

const UserManagementSection = React.memo(({ group }) => (
    <FormSection
        title={i18n.t('User management')}
        description={i18n.t('Add or remove users from this group.')}
    >
        <BulkUserManagerField name="members" groupId={group?.id} />
    </FormSection>
))

UserManagementSection.propTypes = {
    group: PropTypes.object,
}

export default UserManagementSection
