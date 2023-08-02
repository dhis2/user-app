import { useDataEngine } from '@dhis2/app-runtime'
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
    dhis2Password,
    composeValidators,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { TextField } from '../../../../components/Form.js'
import { useUserNameValidator } from '../../../../components/UserForm/validators.js'
import { useFetchAlert } from '../../../../hooks/useFetchAlert.js'
import styles from './ReplicateModal.module.css'

const ReplicateModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const validateUserName = useUserNameValidator({
        user: undefined,
        isInviteUser: false,
    })
    const { showSuccess, showError } = useFetchAlert()

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
            showSuccess(message)
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
            showError(message)
        }
    }

    return (
        <ReactFinalForm.Form onSubmit={handleReplicate}>
            {({ handleSubmit, valid, submitting }) => (
                <Modal small>
                    <ModalTitle>
                        {i18n.t('Replicate user {{- name}}', {
                            name: user.displayName,
                        })}
                    </ModalTitle>
                    <ModalContent className={styles.modalContent}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                name="username"
                                label={i18n.t('Username')}
                                placeholder={i18n.t('Username for new user')}
                                validate={validateUserName}
                                autoComplete="new-password"
                                className={styles.field}
                                component={InputFieldFF}
                            />
                            <TextField
                                name="password"
                                label={i18n.t('Password')}
                                type="password"
                                placeholder={i18n.t('Password for new user')}
                                helpText={i18n.t(
                                    'Password should be at least 8 characters long, with at least one lowercase character, one uppercase character and one special character.'
                                )}
                                validate={composeValidators(
                                    hasValue,
                                    dhis2Password
                                )}
                                autoComplete="new-password"
                                className={styles.field}
                                component={InputFieldFF}
                            />
                        </form>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button
                                secondary
                                onClick={onClose}
                                disabled={submitting}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                disabled={!valid}
                                loading={submitting}
                                onClick={handleSubmit}
                            >
                                {i18n.t('Replicate user')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </ReactFinalForm.Form>
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
