import { SharingDialog } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const SharingSettingsModal = ({ role, onClose }) => (
    <SharingDialog id={role.id} onClose={onClose} type="userRole" />
)

SharingSettingsModal.propTypes = {
    role: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default SharingSettingsModal
