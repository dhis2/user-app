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

const EnableModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const { showSuccess, showError } = useFetchAlert()

    const handleEnable = async () => {
        setLoading(true)
        try {
            await engine.mutate({
                resource: `users/${user.id}`,
                type: 'json-patch',
                data: [
                    {
                        op: 'replace',
                        path: '/disabled',
                        value: false,
                    },
                ],
            })
            const message = i18n.t('User "{{- name}}" enabled successfuly', {
                name: user.displayName,
            })
            showSuccess(message)
            refetchUsers()
            onClose()
        } catch (error) {
            setLoading(false)
            const message = i18n.t(
                'There was an error enabling the user: {{- error}}',
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
                    <Button secondary onClick={onClose} disabled={loading}>
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
