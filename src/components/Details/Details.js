import PropTypes from 'prop-types'
import React from 'react'
import PageHeader from '../../components/PageHeader.js'
import styles from './Details.module.css'

const Details = ({ title, children }) => (
    <>
        <PageHeader>{title}</PageHeader>
        <div className={styles.details}>{children}</div>
    </>
)

Details.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
}

export default Details
