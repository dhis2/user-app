import { useDataMutation } from '@dhis2/app-runtime'
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
import React from 'react'
import { useFetchAlert } from '../../../../hooks/useFetchAlert.js'

const mutation = {
    resource: 'userGroups',
    type: 'delete',
    id: ({ id }) => id,
}

const DeleteModal = ({ group, refetchGroups, onClose }) => {
    const { showSuccess, showError } = useFetchAlert()
    const [deleteGroup, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            const message = i18n.t('Deleted "{{- name}}" successfully', {
                name: group.displayName,
            })
            showSuccess(message)
            refetchGroups()
            onClose()
        },
        onError: (error) => {
            const message = i18n.t(
                'There was an error deleting the user group: {{- error}}',
                {
                    error: error.message,
                    nsSeparator: '-:-',
                }
            )
            showError(message)
        },
    })

    const handleDelete = () => {
        deleteGroup({ id: group.id })
    }

    return (
        <Modal>
            <ModalTitle>
                {i18n.t('Delete user group {{- name}}', {
                    name: group.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to delete {{- name}}?`, {
                    name: group.displayName,
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose} disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        loading={loading}
                        onClick={handleDelete}
                    >
                        {i18n.t('Yes, delete')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DeleteModal.propTypes = {
    group: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    refetchGroups: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default DeleteModal
