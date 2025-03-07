import PropTypes from 'prop-types'
import React from 'react'
import styles from './Field.module.css'

const Field = ({ label, value }) => (
    <div className={styles.field}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
    </div>
)

Field.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
}

export default Field
