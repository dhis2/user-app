import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';

const IconLink = ({ to, tooltip, icon }) => (
    <Link to={to}>
        <IconButton iconClassName="material-icons" tooltip={tooltip}>
            {icon}
        </IconButton>
    </Link>
);

IconLink.propTypes = {
    to: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
};

export default IconLink;
