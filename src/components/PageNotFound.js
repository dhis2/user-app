import React from 'react';
import { Link } from 'react-router-dom';

const style = {
    width: '100%',
    textAlign: 'center',
    padding: '1.5rem 1.5rem 1rem',
};

const PageNotFound = ({ location }) => (
    <div style={style}>
        <h1>Page not found.</h1>
        <h3>
            No match for <code>{location.pathname}</code>
        </h3>
        <Link to="/users">Go back home</Link>
    </div>
);

export default PageNotFound;
