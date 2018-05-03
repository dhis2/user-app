import React from 'react';
import PropTypes from 'prop-types';

const style = {
    clear: 'both',
    color: '#c33017',
    backgroundColor: '#ffe3de',
    padding: '1.5rem 1.5rem 1rem',
};

/**
 * A simple component that can display an error message
 * @class
 */
const ErrorMessage = ({ introText, errorMessage }) => (
    <div style={style}>
        {introText}
        <pre>{errorMessage}</pre>
    </div>
);

ErrorMessage.propTypes = {
    introText: PropTypes.string.isRequired,
    errorMessage: PropTypes.string.isRequired,
};

export default ErrorMessage;
