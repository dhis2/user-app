import { useDataEngine, useAlert } from '@dhis2/app-runtime'
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
import { connect } from 'react-redux'
import { refreshCurrentUser } from '../../../../actions'

const JoinModal = ({
    group,
    refetchGroups,
    currentUser,
    refreshCurrentUser,
    onClose,
}) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        ({ isError }) => (isError ? { critical: true } : { success: true })
    )

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
            showAlert({ message })
            refetchGroups()
            refreshCurrentUser()
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
            showAlert({ message, isError: true })
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
                    <Button secondary onClick={onClose}>
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
    currentUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    group: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    refetchGroups: PropTypes.func.isRequired,
    refreshCurrentUser: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

const mapStateToProps = ({ currentUser }) => ({ currentUser })
const mapDispatchToProps = dispatch => ({
    refreshCurrentUser: () => dispatch(refreshCurrentUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(JoinModal)
