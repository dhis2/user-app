import PropTypes from 'prop-types'
import React from 'react'
import styles from './PageHeader.module.css'

/**
 * Generic page header component used by all pages
 */
const PageHeader = ({ children }) => (
    <h2 className={styles.header} dataTest="page-header">
        {children}
    </h2>
)

PageHeader.propTypes = {
    children: PropTypes.node,
}

export default PageHeader
