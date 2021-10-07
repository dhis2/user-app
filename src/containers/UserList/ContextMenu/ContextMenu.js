import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    Popper,
    FlyoutMenu,
    MenuItem,
    IconUser16,
    IconEdit16,
    IconDelete16,
    IconCopy16,
    IconLock16,
    IconBlock16,
    IconLockOpen16,
    IconCheckmark16,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import navigateTo from '../../../utils/navigateTo'
import ReplicateModal from './Modals/ReplicateModal'
import ResetPasswordModal from './Modals/ResetPasswordModal'

const ContextMenu = ({
    currentUser,
    user,
    anchorRef,
    refetchUsers,
    onClose,
}) => {
    const [CurrentModal, setCurrentModal] = useState(null)
    const {
        access,
        userCredentials: { disabled, twoFA },
    } = user
    const canReplicate =
        access.update && currentUser.authorities.has('F_REPLICATE_USER')
    const canResetPassword =
        access.update &&
        (currentUser.authorities.has('F_USER_ADD') ||
            currentUser.authorities.has('F_USER_ADD_WITHIN_MANAGED_GROUP'))
    const canDelete = currentUser.id !== user.id && access.delete

    const handleShowReplicateModal = () => {
        setCurrentModal(() => ReplicateModal)
    }
    const handleShowResetPasswordModal = () => {
        setCurrentModal(() => ResetPasswordModal)
    }
    const handleShowDisableModal = () => {
        // TODO
    }
    const handleShowEnableModal = () => {
        // TODO
    }
    const handleShowDisable2FaModal = () => {
        // TODO
    }
    const handleShowDeleteModal = () => {
        // TODO
    }
    const handleModalClose = () => {
        setCurrentModal(null)
    }

    return (
        <>
            <Layer onClick={onClose}>
                <Popper reference={anchorRef} placement="bottom-start">
                    <FlyoutMenu>
                        {access.read && (
                            <MenuItem
                                label={i18n.t('Profile')}
                                icon={<IconUser16 color={colors.grey600} />}
                                onClick={() =>
                                    navigateTo(`/users/view/${user.id}`)
                                }
                                dense
                            />
                        )}
                        {access.update && (
                            <MenuItem
                                label={i18n.t('Edit')}
                                icon={<IconEdit16 color={colors.grey600} />}
                                onClick={() =>
                                    navigateTo(`/users/edit/${user.id}`)
                                }
                                dense
                            />
                        )}
                        {canReplicate && (
                            <MenuItem
                                label={i18n.t('Replicate')}
                                icon={<IconCopy16 color={colors.grey600} />}
                                onClick={handleShowReplicateModal}
                                dense
                            />
                        )}
                        {canResetPassword && (
                            <MenuItem
                                label={i18n.t('Reset password')}
                                icon={<IconLock16 color={colors.grey600} />}
                                onClick={handleShowResetPasswordModal}
                                dense
                            />
                        )}
                        {access.update && !disabled && (
                            <MenuItem
                                label={i18n.t('Disable')}
                                icon={<IconBlock16 color={colors.grey600} />}
                                onClick={handleShowDisableModal}
                                dense
                            />
                        )}
                        {access.update && disabled && (
                            <MenuItem
                                label={i18n.t('Enable')}
                                icon={
                                    <IconCheckmark16 color={colors.grey600} />
                                }
                                onClick={handleShowEnableModal}
                                dense
                            />
                        )}
                        {access.update && twoFA && (
                            <MenuItem
                                label={i18n.t(
                                    'Disable Two Factor Authentication'
                                )}
                                icon={<IconLockOpen16 color={colors.grey600} />}
                                onClick={handleShowDisable2FaModal}
                                dense
                            />
                        )}
                        {canDelete && (
                            <MenuItem
                                label={i18n.t('Delete')}
                                icon={<IconDelete16 color={colors.red600} />}
                                onClick={handleShowDeleteModal}
                                destructive
                                dense
                            />
                        )}
                    </FlyoutMenu>
                </Popper>
            </Layer>
            {CurrentModal && (
                <CurrentModal
                    user={user}
                    refetchUsers={refetchUsers}
                    onClose={handleModalClose}
                />
            )}
        </>
    )
}

ContextMenu.propTypes = {
    anchorRef: PropTypes.object.isRequired,
    currentUser: PropTypes.shape({
        authorities: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.shape({
        access: PropTypes.shape({
            delete: PropTypes.bool.isRequired,
            read: PropTypes.bool.isRequired,
            update: PropTypes.bool.isRequired,
        }).isRequired,
        id: PropTypes.string.isRequired,
        userCredentials: PropTypes.shape({
            disabled: PropTypes.bool.isRequired,
            twoFA: PropTypes.bool.isRequired,
        }).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

const mapStateToProps = ({ currentUser }) => ({ currentUser })

export default connect(mapStateToProps)(ContextMenu)
