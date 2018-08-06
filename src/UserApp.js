import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './utils/history';
import injectTapEventPlugin from 'react-tap-event-plugin';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import store from './store';
import './styles/styles.css';
import AppWithD2ContextAndTheme from './components/AppWithD2ContextAndTheme';
import SectionLoader from './components/SectionLoader';
import SnackbarContainer from './components/SnackbarContainer';
import DialogContainer from './components/DialogContainer';
import SharingDialogContainer from './components/SharingDialogContainer';

injectTapEventPlugin();

/**
 * Main Component. Renders a AppWithD2ContextAndTheme wrapped in a Provider containing the HeaderBar,
 * Router, SectionLoader, and various popups
 * @param {Object} props
 * @param {Object} props.d2 - The d2 instance to pass to the Headerbar and AppWithD2ContextAndTheme
 * @class
 */
const UserApp = ({ d2 }) => (
    <Provider store={store}>
        <AppWithD2ContextAndTheme d2={d2}>
            <div>
                <HeaderBar d2={d2} />
                <Router history={history} hashType={'noslash'}>
                    <SectionLoader />
                </Router>
                <SnackbarContainer />
                <DialogContainer />
                <SharingDialogContainer />
            </div>
        </AppWithD2ContextAndTheme>
    </Provider>
);

UserApp.propTypes = {
    d2: PropTypes.object.isRequired,
};

export default UserApp;
