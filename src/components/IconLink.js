import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

/**
 * A component that renders a React-Router Link with an MUI IconButton inside it
 * @class
 */
const IconLink = ({ to, tooltip, icon }) => {
    const iconButton = (
        <IconButton iconClassName="material-icons" tooltip={tooltip}>
            {icon}
        </IconButton>
    )

    return to ? <Link to={to}>{iconButton}</Link> : iconButton
}

IconLink.propTypes = {
    icon: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    to: PropTypes.string,
}

export default IconLink
