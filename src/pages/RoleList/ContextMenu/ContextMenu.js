import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    Popper,
    FlyoutMenu,
    MenuItem,
    IconInfo16,
    IconShare16,
    IconEdit16,
    IconDelete16,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useReferrerInfo } from '../../../providers/index.js'
import navigateTo from '../../../utils/navigateTo.js'
import DeleteModal from './Modals/DeleteModal.js'
import SharingSettingsModal from './Modals/SharingSettingsModal.js'

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

const ContextMenu = ({ role, anchorRef, refetchRoles, onClose }) => {
    const [CurrentModal, setCurrentModal] = useCurrentModal()
    const { access } = role
    const { setReferrer } = useReferrerInfo()

    return (
        <>
            <Layer onBackdropClick={onClose}>
                <Popper reference={anchorRef} placement="bottom-start">
                    <FlyoutMenu>
                        {access.read && (
                            <MenuItem
                                label={i18n.t('Show details')}
                                icon={<IconInfo16 color={colors.grey600} />}
                                onClick={() =>
                                    navigateTo(`/user-roles/view/${role.id}`)
                                }
                                dense
                            />
                        )}
                        {access.manage && (
                            <MenuItem
                                label={i18n.t('Sharing settings')}
                                icon={<IconShare16 color={colors.grey600} />}
                                onClick={() =>
                                    setCurrentModal(SharingSettingsModal)
                                }
                                dense
                            />
                        )}
                        {access.update && (
                            <MenuItem
                                label={i18n.t('Edit')}
                                icon={<IconEdit16 color={colors.grey600} />}
                                onClick={() => {
                                    setReferrer('user-roles')
                                    navigateTo(`/user-roles/edit/${role.id}`)
                                }}
                                dense
                            />
                        )}
                        {access.delete && (
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
                    role={role}
                    refetchRoles={refetchRoles}
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
    refetchRoles: PropTypes.func.isRequired,
    role: PropTypes.shape({
        access: PropTypes.shape({
            delete: PropTypes.bool.isRequired,
            manage: PropTypes.bool.isRequired,
            read: PropTypes.bool.isRequired,
            update: PropTypes.bool.isRequired,
        }).isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ContextMenu
