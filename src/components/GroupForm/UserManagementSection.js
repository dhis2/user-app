import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection } from '../Form.js'
import BulkUserManagerField from './BulkUserManager/BulkUserManagerField.js'
import styles from './UserManagementSection.module.css'

const UserManagementSection = React.memo(({ group }) => (
    <FormSection
        title={i18n.t('User management')}
        description={i18n.t('Add or remove users from this group.')}
    >
        <BulkUserManagerField
            name="members"
            groupId={group?.id}
            className={styles.bulkUserManagerField}
        />
    </FormSection>
))

UserManagementSection.propTypes = {
    group: PropTypes.object,
}

export default UserManagementSection
