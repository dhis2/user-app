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

const Disable2FaModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const { showSuccess, showError } = useFetchAlert()

    const handleDisable2Fa = async () => {
        setLoading(true)
        try {
            await engine.mutate({
                resource: `users/${user.id}/twoFA/disabled`,
                type: 'create',
            })
            const message = i18n.t(
                'Disabled two factor authentication for "{{- name}}" successfuly',
                {
                    name: user.displayName,
                }
            )
            showSuccess(message)
            refetchUsers()
            onClose()
        } catch (error) {
            setLoading(false)
            const message = i18n.t(
                'There was an error disabling two factor authentication: {{- error}}',
                {
                    error: error.message,
                    nsSeparator: '-:-',
                }
            )
            showError(message)
        }
    }

    return (
        <Modal>
            <ModalTitle>
                {i18n.t(
                    'Disable two factor authentication for user {{- name}}',
                    {
                        name: user.displayName,
                    }
                )}
            </ModalTitle>
            <ModalContent>
                {i18n.t(
                    `Are you sure you want to disable two factor authentication for {{- name}}?`,
                    {
                        name: user.displayName,
                    }
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose} disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        primary
                        loading={loading}
                        onClick={handleDisable2Fa}
                    >
                        {i18n.t('Yes, disable two factor authentication')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

Disable2FaModal.propTypes = {
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default Disable2FaModal
