import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useField } from 'react-final-form'
import { FormSection, SingleSelectField } from '../Form.js'

const InviteUserSection = ({ user, emailConfigured, setIsInvite }) => {
    const {
        input: { value },
    } = useField('inviteUser', { subscription: { value: true } })

    useEffect(() => {
        setIsInvite(value === 'INVITE_USER')
    }, [value, setIsInvite])

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
    setIsInvite: PropTypes.func,
    user: PropTypes.object,
}

export default InviteUserSection
