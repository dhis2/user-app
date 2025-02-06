import { Menu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './SideNav.module.css'

const NavItem = ({ path, label }) => {
    const history = useHistory()
    const match = useRouteMatch(path)
    const active = match?.isExact

    return (
        <MenuItem
            // Has no effect until the component supports arbitrary attributes,
            // but I put it here so we don't forget.
            // See https://www.aditus.io/aria/aria-current/
            aria-current={active ? 'page' : undefined}
            active={active}
            onClick={() => history.push(path)}
            label={label}
            className={styles.navItem}
        />
    )
}

NavItem.propTypes = {
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
}

/**
 * Renders the sidebar containing the available sections.
 * If its on a path/route that doesn't match any section it will render null.
 * This is because when a form or the CardLinks are displayed, the sidebar should not show.
 */
const SideNav = ({ children }) => (
    <nav
        // See http://web-accessibility.carnegiemuseums.org/code/navigation/
        role="nav"
        aria-label="Main Navigation"
        className={styles.nav}
    >
        <Menu>{children}</Menu>
    </nav>
)

SideNav.propTypes = {
    children: PropTypes.node.isRequired,
}

export { SideNav, NavItem }
