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
import { useCurrentUser } from '../../../../hooks/useCurrentUser.js'
import { useFetchAlert } from '../../../../hooks/useFetchAlert.js'

const JoinModal = ({ group, refetchGroups, onClose }) => {
    const currentUser = useCurrentUser()
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const { showSuccess, showError } = useFetchAlert()

    const handleJoin = async () => {
        setLoading(true)
        try {
            await engine.mutate({
                resource: `users/${currentUser.id}/userGroups/${group.id}`,
                type: 'create',
            })
            const message = i18n.t(
                'Joined user group "{{- name}}" successfuly',
                {
                    name: group.displayName,
                }
            )
            showSuccess(message)
            refetchGroups()
            currentUser.refresh()
            onClose()
        } catch (error) {
            setLoading(false)
            const message = i18n.t(
                'There was an error joining the user group: {{- error}}',
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
                {i18n.t('Join user group {{- name}}', {
                    name: group.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to join {{- name}}?`, {
                    name: group.displayName,
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose} disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleJoin}>
                        {i18n.t('Yes, join')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

JoinModal.propTypes = {
    group: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    refetchGroups: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default JoinModal
