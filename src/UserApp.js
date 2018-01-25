import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import store from './store';
import './styles/styles.css';
import SectionLoader from './components/SectionLoader';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);
injectTapEventPlugin();

// TODO: pass config as parameter in index.js after manifest is loaded
const UserApp = () => {
    const config = {
        baseUrl: 'http://localhost:8080/dhis/api',
        schemas: ['userRole', 'user', 'userGroup'],
    };
    return (
        <Provider store={store}>
            <D2UIApp initConfig={config} LoadingComponent={LoadingMask}>
                <div>
                    <HeaderBar />
                    <HashRouter hashType={'noslash'}>
                        <SectionLoader />
                    </HashRouter>
                </div>
            </D2UIApp>
        </Provider>
    );
};

export default UserApp;
