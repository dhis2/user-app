import PropTypes from 'prop-types'
import React from 'react'
import styles from './Details.module.css'

const Details = ({ title, children }) => (
    <>
        <h2>{title}</h2>
        <div className={styles.details}>{children}</div>
    </>
)

Details.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
}

export default Details
