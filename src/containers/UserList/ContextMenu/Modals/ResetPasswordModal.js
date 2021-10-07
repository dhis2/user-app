import { useDataEngine, useAlert } from '@dhis2/app-runtime'
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

const ResetPasswordModal = ({ user, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const successAlert = useAlert(
        i18n.t('Password of user "{{- name}}" reset successfuly', {
            name: user.displayName,
        }),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('There was an error resetting the password: {{- error}}', {
                error: error.message,
                nsSeparator: '-:-',
            }),
        {
            critical: true,
        }
    )

    const handleReset = () => {
        setLoading(true)
        engine.mutate(
            {
                resource: `users/${user.id}/reset`,
                type: 'create',
            },
            {
                onComplete: () => {
                    successAlert.show()
                    onClose()
                },
                onError: error => {
                    setLoading(false)
                    errorAlert.show({ error })
                },
            }
        )
    }

    return (
        <Modal small>
            <ModalTitle>
                {i18n.t('Reset password of user {{- name}}', {
                    name: user.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(
                    `Are you sure you want to reset {{- name}}'s password?`,
                    { name: user.displayName }
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
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
