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

const ResetPasswordModal = ({ user, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const { showSuccess, showError } = useFetchAlert()

    const handleReset = async () => {
        setLoading(true)
        try {
            await engine.mutate({
                resource: `users/${user.id}/reset`,
                type: 'create',
            })
            const message = i18n.t(
                'Password of user "{{- name}}" reset successfuly',
                {
                    name: user.displayName,
                }
            )
            showSuccess(message)
            onClose()
        } catch (error) {
            setLoading(false)
            const message = i18n.t(
                'There was an error resetting the password: {{- error}}',
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
            <ModalTitle>{i18n.t('Reset password')}</ModalTitle>
            <ModalContent>
                {i18n.t(
                    `Are you sure you want to reset the password for {{- name}}?`,
                    { name: user.displayName }
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose} disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleReset}>
                        {i18n.t('Yes, reset')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

ResetPasswordModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ResetPasswordModal
