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
    resource: 'users',
    type: 'delete',
    id: ({ id }) => id,
}

const DeleteModal = ({ user, refetchUsers, onClose }) => {
    const { showSuccess, showError } = useFetchAlert()
    const [deleteUser, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            const message = i18n.t('Deleted "{{- name}}" successfully', {
                name: user.displayName,
            })
            showSuccess(message)
            refetchUsers()
            onClose()
        },
        onError: (error) => {
            const message = i18n.t(
                'There was an error deleting the user: {{- error}}',
                {
                    error: error.message,
                    nsSeparator: '-:-',
                }
            )
            showError(message)
        },
    })

    const handleDelete = () => {
        deleteUser({ id: user.id })
    }

    return (
        <Modal>
            <ModalTitle>
                {i18n.t('Delete user {{- name}}', {
                    name: user.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to delete {{- name}}?`, {
                    name: user.displayName,
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
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default DeleteModal
