import PropTypes from 'prop-types'
import React from 'react'
import styles from './EmptyTableInfo.module.css'

const EmptyTableInfo = ({ action, header, icon, text }) => (
    <>
        <div className={styles.wrapper} data-test="data-test-empty-table-info">
            <div className={styles.icon}>{icon}</div>
            <p className={styles.header}>{header}</p>
            <p className={styles.text}>{text}</p>
            <div className={styles.action}>{action}</div>
        </div>
    </>
)

EmptyTableInfo.propTypes = {
    action: PropTypes.node,
    header: PropTypes.node,
    icon: PropTypes.node,
    text: PropTypes.node,
}

export default EmptyTableInfo
