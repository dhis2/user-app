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
    resource: 'users',
    type: 'delete',
    id: ({ id }) => id,
}

const DeleteModal = ({ user, refetchUsers, onClose }) => {
    const successAlert = useAlert(
        i18n.t('Deleted "{{- name}}" successfuly', {
            name: user.displayName,
        }),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('There was an error deleting the user: {{- error}}', {
                error: error.message,
                nsSeparator: '-:-',
            }),
        {
            critical: true,
        }
    )
    const [deleteUser, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            refetchUsers()
            successAlert.show()
            onClose()
        },
        onError: error => {
            errorAlert.show({ error })
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
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default DeleteModal
