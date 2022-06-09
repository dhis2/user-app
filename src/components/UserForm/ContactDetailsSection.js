import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection, TextField } from '../Form.js'

const ContactDetailsSection = React.memo(({ user }) => (
    <FormSection title={i18n.t('Contact details')}>
        <TextField
            name="phoneNumber"
            label={i18n.t('Mobile phone number')}
            initialValue={user?.phoneNumber}
        />
        <TextField
            name="whatsApp"
            label={i18n.t('WhatsApp')}
            initialValue={user?.whatsApp}
        />
        <TextField
            name="facebookMessenger"
            label={i18n.t('Facebook Messenger')}
            initialValue={user?.facebookMessenger}
        />
        <TextField
            name="skype"
            label={i18n.t('Skype')}
            initialValue={user?.skype}
        />
        <TextField
            name="telegram"
            label={i18n.t('Telegram')}
            initialValue={user?.telegram}
        />
        <TextField
            name="twitter"
            label={i18n.t('Twitter')}
            initialValue={user?.twitter}
        />
    </FormSection>
))

ContactDetailsSection.propTypes = {
    user: PropTypes.object,
}

export default ContactDetailsSection
