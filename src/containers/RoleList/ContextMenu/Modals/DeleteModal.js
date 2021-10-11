import { useDataMutation, useAlert } from '@dhis2/app-runtime'
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

const mutation = {
    resource: 'userRoles',
    type: 'delete',
    id: ({ id }) => id,
}

const DeleteModal = ({ role, refetchRoles, onClose }) => {
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ isError }) => (isError ? { critical: true } : { success: true })
    )
    const [deleteRole, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            const message = i18n.t('Deleted "{{- name}}" successfully', {
                name: role.displayName,
            })
            showAlert({ message })
            refetchRoles()
            onClose()
        },
        onError: error => {
            const message = i18n.t(
                'There was an error deleting the user role: {{- error}}',
                {
                    error: error.message,
                    nsSeparator: '-:-',
                }
            )
            showAlert({ message, isError: true })
        },
    })

    const handleDelete = () => {
        deleteRole({ id: role.id })
    }

    return (
        <Modal>
            <ModalTitle>
                {i18n.t('Delete user role {{- name}}', {
                    name: role.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(`Are you sure you want to delete {{- name}}?`, {
                    name: role.displayName,
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button primary loading={loading} onClick={handleDelete}>
                        {i18n.t('Yes, delete')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DeleteModal.propTypes = {
    refetchRoles: PropTypes.func.isRequired,
    role: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default DeleteModal
