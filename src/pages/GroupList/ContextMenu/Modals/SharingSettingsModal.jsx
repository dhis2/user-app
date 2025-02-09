import { SharingDialog } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const SharingSettingsModal = ({ group, onClose }) => (
    <SharingDialog id={group.id} onClose={onClose} type="userGroup" />
)

SharingSettingsModal.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default SharingSettingsModal
