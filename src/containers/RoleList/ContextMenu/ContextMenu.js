import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    Popper,
    FlyoutMenu,
    MenuItem,
    IconInfo16,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import navigateTo from '../../../utils/navigateTo'

const useCurrentModal = () => {
    const [CurrentModal, setCurrentModal] = useState()

    return [
        CurrentModal,
        Modal => {
            // As setState supports functional updates, we can't pass functional
            // components directly
            setCurrentModal(() => Modal)
        },
    ]
}

const ContextMenu = ({ role, anchorRef, refetchRoles, onClose }) => {
    const [CurrentModal, setCurrentModal] = useCurrentModal()
    const { access } = role

    return (
        <>
            <Layer onClick={onClose}>
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
                    </FlyoutMenu>
                </Popper>
            </Layer>
            {CurrentModal && (
                <CurrentModal
                    role={role}
                    refetchRoles={refetchRoles}
                    onClose={() => setCurrentModal(null)}
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
            read: PropTypes.bool.isRequired,
            update: PropTypes.bool.isRequired,
        }).isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ContextMenu
