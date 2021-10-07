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

const EnableModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const successAlert = useAlert(
        i18n.t('User "{{- name}}" enabled successfuly', {
            name: user.displayName,
        }),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('There was an error enabling the user: {{- error}}', {
                error: error.message,
                nsSeparator: '-:-',
            }),
        {
            critical: true,
        }
    )

    const handleEnable = () => {
        setLoading(true)
        engine.mutate(
            {
                resource: `users/${user.id}`,
                type: 'update',
                partial: true,
                data: { userCredentials: { disabled: false } },
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
                {i18n.t('Enable user {{- name}}', {
                    name: user.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to enable {{- name}}?`, {
                    name: user.displayName,
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleEnable}>
                        {i18n.t('Yes, enable')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

EnableModal.propTypes = {
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default EnableModal
