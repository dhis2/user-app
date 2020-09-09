import React from 'react'
import PropTypes from 'prop-types'

const style = {
    clear: 'both',
    color: '#c33017',
    backgroundColor: '#ffe3de',
    padding: '1.5rem 1.5rem 1rem',
    fontSize: '1rem',
    width: '100%',
}

/**
 * A simple component that can display an error message
 * @class
 */
const ErrorMessage = ({ introText, errorMessage }) => (
    <div style={style}>
        {introText}
        <pre>{errorMessage}</pre>
    </div>
)

ErrorMessage.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    introText: PropTypes.string.isRequired,
}

export default ErrorMessage
