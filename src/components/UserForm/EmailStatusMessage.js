import {
    IconCheckmarkCircle16,
    colors,
    IconWarning16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './UserForm.module.css'

const EmailStatusMessage = ({ emailVerified, enforceVerifiedEmail }) => {
    let icon = ''
    let color = ''
    let message = ''

    if (enforceVerifiedEmail) {
        if (emailVerified) {
            color = colors.green600
            icon = IconCheckmarkCircle16
            message = i18n.t('This email has been verified.')
        }
        if (!emailVerified) {
            color = colors.red600
            icon = IconWarning16
            message = i18n.t('This email has not been verified.')
        }
    } else {
        if (!emailVerified) {
            color = colors.default
            icon = IconWarning16
            message = i18n.t('This email has not been verified.')
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
}

export default EmailStatusMessage
