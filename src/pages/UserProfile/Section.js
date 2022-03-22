import PropTypes from 'prop-types'
import React from 'react'
import styles from './Section.module.css'

const Section = ({ title, children, action }) => (
    <section className={styles.section}>
        <header className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <div>{action}</div>
        </header>
        {children}
    </section>
)

Section.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    action: PropTypes.node,
}

export default Section
