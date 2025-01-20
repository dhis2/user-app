import i18n from '@dhis2/d2-i18n'
import { IconCheckmarkCircle16, colors, IconWarning16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './UserForm.module.css'

const EmailStatusMessage = ({ email, emailVerified, enforceVerifiedEmail }) => {
    let icon
    let color
    let message

    if (enforceVerifiedEmail) {
        if (email && emailVerified) {
            color = colors.green600
            icon = IconCheckmarkCircle16
            message = i18n.t('This email has been verified.')
        }
        if (email && !emailVerified) {
            color = colors.red600
            icon = IconWarning16
            message = i18n.t('This email has not been verified.')
        }
    } else {
        if (!email || !emailVerified) {
            color = colors.default
            icon = IconWarning16
            message = i18n.t('This user does not have a verified email')
        }
    }

    return (
        <div className={styles.statusMessage}>
            <span>{React.createElement(icon, { color })}</span>
            <div style={{ color }}>{message}</div>
        </div>
    )
}

EmailStatusMessage.propTypes = {
    emailVerified: PropTypes.bool.isRequired,
    enforceVerifiedEmail: PropTypes.bool.isRequired,
    email: PropTypes.string,
}

export default EmailStatusMessage
