import { useConfig } from '@dhis2/app-runtime'
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
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useReferrerInfo } from '../../../providers/useReferrer.js'
import navigateTo from '../../../utils/navigateTo.js'
import DeleteModal from './Modals/DeleteModal.js'
import Disable2FaModal from './Modals/Disable2FaModal.js'
import DisableModal from './Modals/DisableModal.js'
import EnableModal from './Modals/EnableModal.js'
import ReplicateModal from './Modals/ReplicateModal.js'
import ResetPasswordModal from './Modals/ResetPasswordModal.js'

const useCurrentModal = () => {
    const [CurrentModal, setCurrentModal] = useState()

    return [
        CurrentModal,
        (Modal) => {
            // As setState supports functional updates, we can't pass functional
            // components directly
            setCurrentModal(() => Modal)
        },
    ]
}

const ContextMenu = ({ user, anchorRef, refetchUsers, onClose }) => {
    const currentUser = useCurrentUser()
    const {
        systemInfo: { emailConfigured },
    } = useConfig()
    const [CurrentModal, setCurrentModal] = useCurrentModal()
    const { access, twoFactorEnabled, disabled } = user
    const canReplicate =
        access.update &&
        currentUser.authorities.some(
            (auth) => auth === 'ALL' || auth === 'F_REPLICATE_USER'
        )
    const canResetPassword =
        emailConfigured &&
        user.email &&
        access.update &&
        currentUser.authorities.some(
            (auth) =>
                auth === 'ALL' ||
                auth === 'F_USER_ADD' ||
                auth === 'F_USER_ADD_WITHIN_MANAGED_GROUP'
        )
    const canDisable = currentUser.id !== user.id && access.update && !disabled
    const canDelete = currentUser.id !== user.id && access.delete
    const { setReferrer } = useReferrerInfo()

    return (
        <>
            <Layer onBackdropClick={onClose}>
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
                                onClick={() => {
                                    setReferrer('users')
                                    navigateTo(`/users/edit/${user.id}`)
                                }}
                                dense
                            />
                        )}
                        {canReplicate && (
                            <MenuItem
                                label={i18n.t('Replicate')}
                                icon={<IconCopy16 color={colors.grey600} />}
                                onClick={() => setCurrentModal(ReplicateModal)}
                                dense
                            />
                        )}
                        {canResetPassword && (
                            <MenuItem
                                label={i18n.t('Reset password')}
                                icon={<IconLock16 color={colors.grey600} />}
                                onClick={() =>
                                    setCurrentModal(ResetPasswordModal)
                                }
                                dense
                            />
                        )}
                        {canDisable && (
                            <MenuItem
                                label={i18n.t('Disable')}
                                icon={<IconBlock16 color={colors.grey600} />}
                                onClick={() => setCurrentModal(DisableModal)}
                                dense
                            />
                        )}
                        {access.update && disabled && (
                            <MenuItem
                                label={i18n.t('Enable')}
                                icon={
                                    <IconCheckmark16 color={colors.grey600} />
                                }
                                onClick={() => setCurrentModal(EnableModal)}
                                dense
                            />
                        )}
                        {access.update && twoFactorEnabled && (
                            <MenuItem
                                label={i18n.t(
                                    'Disable Two Factor Authentication'
                                )}
                                icon={<IconLockOpen16 color={colors.grey600} />}
                                onClick={() => setCurrentModal(Disable2FaModal)}
                                dense
                            />
                        )}
                        {canDelete && (
                            <MenuItem
                                label={i18n.t('Delete')}
                                icon={<IconDelete16 color={colors.red600} />}
                                onClick={() => setCurrentModal(DeleteModal)}
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
                    onClose={() => {
                        onClose()
                        setCurrentModal(null)
                    }}
                />
            )}
        </>
    )
}

ContextMenu.propTypes = {
    anchorRef: PropTypes.object.isRequired,
    refetchUsers: PropTypes.func.isRequired,
    user: PropTypes.shape({
        access: PropTypes.shape({
            delete: PropTypes.bool.isRequired,
            read: PropTypes.bool.isRequired,
            update: PropTypes.bool.isRequired,
        }).isRequired,
        disabled: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired,
        twoFactorEnabled: PropTypes.bool.isRequired,
        email: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ContextMenu
