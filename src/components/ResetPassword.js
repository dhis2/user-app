import i18n from '@dhis2/d2-i18n'
import { RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

/**
 * Content for the reset password dialog
 */
class ResetPassword extends Component {
    render() {
        const { onCancel, onConfirm } = this.props

        return (
            <div>
                <p style={{ marginTop: '0px', marginBottom: '16px' }}>
                    {i18n.t(
                        'This will reset the user password. If you confirm, the user will receive an email with a link they can use to reset their account password.'
                    )}
                </p>
                <RaisedButton
                    label={i18n.t('Reset user password')}
                    type="button"
                    onClick={onConfirm}
                    primary={true}
                />
                <RaisedButton
                    label={i18n.t('Cancel')}
                    type="button"
                    onClick={onCancel}
                    style={{ marginLeft: 8 }}
                />
            </div>
        )
    }
}

ResetPassword.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
}

export default ResetPassword
