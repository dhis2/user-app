import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import theme from './theme';
import history from './utils/history';
import injectTapEventPlugin from 'react-tap-event-plugin';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import store from './store';
import './styles/styles.css';
import SectionLoader from './components/SectionLoader';
import SnackbarContainer from './components/SnackbarContainer';
import DialogContainer from './components/DialogContainer';
import SharingDialogContainer from './components/SharingDialogContainer';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

injectTapEventPlugin();

/**
 * Main Component. Renders a D2UIApp wrapped in a Provider containing the HeaderBar,
 * Router, SectionLoader, and various popups
 * @param {Object} props
 * @param {Object} props.config - The d2 config object to pass to the D2UIApp
 * @class
 */
const UserApp = ({ config }) => (
    <Provider store={store}>
        <D2UIApp initConfig={config} LoadingComponent={LoadingMask} muiTheme={theme}>
            <div>
                <HeaderBar />
                <Router history={history} hashType={'noslash'}>
                    <SectionLoader />
                </Router>
                <SnackbarContainer />
                <DialogContainer />
                <SharingDialogContainer />
            </div>
        </D2UIApp>
    </Provider>
);

UserApp.propTypes = {
    config: PropTypes.object.isRequired,
};

export default UserApp;
