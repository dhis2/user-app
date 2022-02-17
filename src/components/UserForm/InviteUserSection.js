import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection, SingleSelectField } from '../Form'

const InviteUserSection = ({ user, emailConfigured }) => {
    if (user || !emailConfigured) {
        return null
    }

    return (
        <FormSection title={i18n.t('Invite user')}>
            <SingleSelectField
                name="inviteUser"
                label={i18n.t('Create account or email invitation')}
                initialValue="SET_PASSWORD"
                options={[
                    {
                        label: i18n.t('Create account with user details'),
                        value: 'SET_PASSWORD',
                    },
                    {
                        label: i18n.t('Email invitation to create account'),
                        value: 'INVITE_USER',
                    },
                ]}
            />
        </FormSection>
    )
}

InviteUserSection.propTypes = {
    emailConfigured: PropTypes.bool,
    user: PropTypes.object,
}

export default InviteUserSection
