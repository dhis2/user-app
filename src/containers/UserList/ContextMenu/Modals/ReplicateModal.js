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
import React, { useState } from 'react'
import styles from './ReplicateModal.module.css'

const ReplicateModal = ({ user, refetchUsers, onClose }) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const successAlert = useAlert(
        i18n.t('User "{{- name}}" replicated successfuly', {
            name: user.displayName,
        }),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('There was an error replicating the user: {{- error}}', {
                error: error.message,
                nsSeparator: '-:-',
            }),
        {
            critical: true,
        }
    )

    const handleReplicate = ({ username, password }) => {
        setLoading(true)
        engine.mutate(
            {
                resource: `users/${user.id}/replica`,
                type: 'create',
                data: { username, password },
            },
            {
                onComplete: () => {
                    successAlert.show()
                    refetchUsers()
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
                {i18n.t('Replicate user {{- name}}', {
                    name: user.displayName,
                })}
            </ModalTitle>
            <ReactFinalForm.Form onSubmit={handleReplicate}>
                {({ handleSubmit, valid }) => (
                    <>
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
                                    onClick={handleSubmit}
                                    disabled={!valid}
                                    loading={loading}
                                >
                                    {i18n.t('Replicate user')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    </>
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
