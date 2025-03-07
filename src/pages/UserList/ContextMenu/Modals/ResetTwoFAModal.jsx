import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useFetchAlert } from '../../../../hooks/useFetchAlert.js'
import styles from './ResetTwoFAModal.module.css'

const ResetTwoFAModal = ({ user, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const { showSuccess, showError } = useFetchAlert()

    const handleReset2FA = async () => {
        setLoading(true)
        try {
            await engine.mutate({
                resource: `users/${user.id}/twoFA/disabled`,
                type: 'create',
            })
            const message = i18n.t(
                'Two factor authentication for "{{- name}}" has reset successfully',
                {
                    name: user.displayName,
                }
            )
            showSuccess(message)
            onClose()
        } catch (error) {
            setLoading(false)
            const message = i18n.t(
                'There was an error resetting the two factor authentication: {{- error}}',
                {
                    error: error.message,
                    nsSeparator: '-:-',
                }
            )
            showError(message)
        }
    }

    return (
        <Modal small>
            <ModalTitle>{i18n.t('Reset two factor authentication')}</ModalTitle>
            <ModalContent>
                <div>
                    {i18n.t(
                        `If {{- name}} has two factor authentication enabled, resetting the two factor authentication will make it possible for them to log in without providing a two factor authentication code.`,
                        { name: user.displayName }
                    )}
                </div>
                <div className={styles.secondary2FAModalText}>
                    {i18n.t(
                        `Are you sure you want to reset two factor authentication for {{- name}}?`,
                        { name: user.displayName }
                    )}
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose} disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleReset2FA}>
                        {i18n.t('Yes, reset')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

ResetTwoFAModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ResetTwoFAModal
