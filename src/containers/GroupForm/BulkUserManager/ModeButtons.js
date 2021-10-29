import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ModeButtons.module.css'

const ModeButtons = ({ mode, onModeChange }) => (
    <div className={styles.container}>
        <button
            type="button"
            className={
                mode === 'MEMBERS'
                    ? styles.selectedModeButton
                    : styles.modeButton
            }
            onClick={() => onModeChange('MEMBERS')}
        >
            {i18n.t('View and remove users from group')}
        </button>
        <button
            type="button"
            className={
                mode === 'NON_MEMBERS'
                    ? styles.selectedModeButton
                    : styles.modeButton
            }
            onClick={() => onModeChange('NON_MEMBERS')}
        >
            {i18n.t('Add users to group')}
        </button>
    </div>
)

ModeButtons.propTypes = {
    mode: PropTypes.oneOf(['MEMBERS', 'NON_MEMBERS']).isRequired,
    onModeChange: PropTypes.func.isRequired,
}

export default ModeButtons
