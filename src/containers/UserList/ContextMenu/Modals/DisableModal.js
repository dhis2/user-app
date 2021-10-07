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

const DisableModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const successAlert = useAlert(
        i18n.t('User "{{- name}}" disabled successfuly', {
            name: user.displayName,
        }),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('There was an error disabling the user: {{- error}}', {
                error: error.message,
                nsSeparator: '-:-',
            }),
        {
            critical: true,
        }
    )

    const handleDisable = () => {
        setLoading(true)
        engine.mutate(
            {
                resource: `users/${user.id}`,
                type: 'update',
                partial: true,
                data: { userCredentials: { disabled: true } },
            },
            {
                onComplete: () => {
                    refetchUsers()
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
                {i18n.t('Disable user {{- name}}', {
                    name: user.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to disable {{- name}}?`, {
                    name: user.displayName,
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleDisable}>
                        {i18n.t('Yes, disable')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DisableModal.propTypes = {
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default DisableModal
