import React from 'react';

const style = {
    clear: 'both',
    color: '#c33017',
    backgroundColor: '#ffe3de',
    padding: '1.5rem 1.5rem 1rem',
};

const ErrorMessage = ({ introText, errorMessage }) => (
    <div style={style}>
        {introText}
        <pre>{errorMessage}</pre>
    </div>
);

export default ErrorMessage;