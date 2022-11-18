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

const LeaveModal = ({ group, refetchGroups, onClose }) => {
    const engine = useDataEngine()
    const currentUser = useCurrentUser()
    const [loading, setLoading] = useState(false)
    const { showSuccess, showError } = useFetchAlert()

    const handleLeave = async () => {
        setLoading(true)
        try {
            await engine.mutate({
                resource: `users/${currentUser.id}/userGroups/${group.id}`,
                type: 'delete',
            })
            const message = i18n.t('Left user group "{{- name}}" successfuly', {
                name: group.displayName,
            })
            showSuccess(message)
            refetchGroups()
            currentUser.refresh()
            onClose()
        } catch (error) {
            setLoading(false)
            const message = i18n.t(
                'There was an error leaving the user group: {{- error}}',
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
                {i18n.t('Leave user group {{- name}}', {
                    name: group.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to leave {{- name}}?`, {
                    name: group.displayName,
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose} disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleLeave}>
                        {i18n.t('Yes, leave')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

LeaveModal.propTypes = {
    group: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    refetchGroups: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default LeaveModal
