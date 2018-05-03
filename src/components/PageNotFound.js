import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import { Link } from 'react-router-dom';

const style = {
    width: '100%',
    textAlign: 'center',
    padding: '1.5rem 1.5rem 1rem',
};
/**
 * Will display when no matching route was found.
 * Renders text and the pathname that is in the URL after the `/#`
 * @class
 */
const PageNotFound = ({ location }) => (
    <div style={style}>
        <h1>{i18n.t('Page not found.')}</h1>
        <h3>
            {i18n.t('No match for')}
            <code> {location.pathname}</code>
        </h3>
        <Link to="/"> {i18n.t('Go back home')}</Link>
    </div>
);

PageNotFound.propTypes = {
    location: PropTypes.object.isRequired,
};

export default PageNotFound;
