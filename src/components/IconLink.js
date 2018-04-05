import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';

const IconLink = ({ to, tooltip, icon }) => {
    const iconButton = (
        <IconButton iconClassName="material-icons" tooltip={tooltip}>
            {icon}
        </IconButton>
    );

    return to ? <Link to={to}>{iconButton}</Link> : iconButton;
};

IconLink.propTypes = {
    to: PropTypes.string,
    tooltip: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
};

export default IconLink;
