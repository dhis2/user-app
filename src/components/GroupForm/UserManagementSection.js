import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection } from '../Form'
import BulkUserManager from './BulkUserManager/index.js'
import styles from './GroupForm.module.css'

// TODO: Support user management for new groups
const UserManagementSection = ({ group }) => (
    <FormSection
        title={i18n.t('User management')}
        description={i18n.t('Add or remove users from this group.')}
    >
        {group ? (
            <BulkUserManager groupId={group.id} />
        ) : (
            <NoticeBox className={styles.noticeBox}>
                {i18n.t(
                    'You must save this group before you can manage its members.'
                )}
            </NoticeBox>
        )}
    </FormSection>
)

UserManagementSection.propTypes = {
    group: PropTypes.object,
}

export default UserManagementSection
