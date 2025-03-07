import PropTypes from 'prop-types'
import React from 'react'
import styles from './EmptyTableInfo.module.css'

const EmptyTableInfo = ({ footer, header, icon, text }) => (
    <div className={styles.wrapper} data-test="data-test-empty-table-info">
        <div className={styles.icon}>{icon}</div>
        <p className={styles.header}>{header}</p>
        <p className={styles.text}>{text}</p>
        <div className={styles.footer}>{footer}</div>
    </div>
)

EmptyTableInfo.propTypes = {
    footer: PropTypes.node,
    header: PropTypes.string,
    icon: PropTypes.node,
    text: PropTypes.string,
}

export default EmptyTableInfo
