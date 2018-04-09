import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Link } from 'react-router-dom';

const style = {
    width: '100%',
    textAlign: 'center',
    padding: '1.5rem 1.5rem 1rem',
};

const PageNotFound = ({ location }) => (
    <div style={style}>
        <h1>{i18next.t('Page not found.')}</h1>
        <h3>
            {i18next.t('No match for')}
            <code> {location.pathname}</code>
        </h3>
        <Link to="/"> {i18next.t('Go back home')}</Link>
    </div>
);

PageNotFound.propTypes = {
    location: PropTypes.object.isRequired,
};

export default PageNotFound;
