import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    ReactFinalForm,
    InputFieldFF,
    dhis2Username,
    dhis2Password,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ReplicateModal.module.css'

const ReplicateModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ isError }) => (isError ? { critical: true } : { success: true })
    )

    const handleReplicate = async ({ username, password }) => {
        try {
            await engine.mutate({
                resource: `users/${user.id}/replica`,
                type: 'create',
                data: { username, password },
            })
            const message = i18n.t('User "{{- name}}" replicated successfuly', {
                name: user.displayName,
            })
            showAlert({ message })
            refetchUsers()
            onClose()
        } catch (error) {
            const message = i18n.t(
                'There was an error replicating the user: {{- error}}',
                {
                    error: error.message,
                    nsSeparator: '-:-',
                }
            )
            showAlert({ message, isError: true })
        }
    }

    return (
        <Modal small>
            <ModalTitle>
                {i18n.t('Replicate user {{- name}}', {
                    name: user.displayName,
                })}
            </ModalTitle>
            <ReactFinalForm.Form onSubmit={handleReplicate}>
                {({ handleSubmit, valid, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <ModalContent>
                            <ReactFinalForm.Field
                                name="username"
                                label={i18n.t('Username')}
                                placeholder={i18n.t('Username for new user')}
                                validate={dhis2Username}
                                autoComplete="new-password"
                                className={styles.field}
                                component={InputFieldFF}
                            />
                            <ReactFinalForm.Field
                                name="password"
                                label={i18n.t('Password')}
                                type="password"
                                placeholder={i18n.t('Password for new user')}
                                helpText={i18n.t(
                                    'Password should be at least 8 characters long, with at least one lowercase character, one uppercase character and one special character.'
                                )}
                                validate={dhis2Password}
                                autoComplete="new-password"
                                className={styles.field}
                                component={InputFieldFF}
                            />
                        </ModalContent>
                        <ModalActions>
                            <ButtonStrip end>
                                <Button secondary onClick={onClose}>
                                    {i18n.t('Cancel')}
                                </Button>
                                <Button
                                    primary
                                    type="submit"
                                    disabled={!valid}
                                    loading={submitting}
                                >
                                    {i18n.t('Replicate user')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    </form>
                )}
            </ReactFinalForm.Form>
        </Modal>
    )
}

ReplicateModal.propTypes = {
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ReplicateModal
