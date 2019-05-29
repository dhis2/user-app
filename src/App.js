import '@babel/polyfill'
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import history from './utils/history'
import store from './store'
import './styles/styles.css'
import AppWithD2ContextAndTheme from './components/AppWithD2ContextAndTheme'
import SectionLoader from './components/SectionLoader'
import SnackbarContainer from './components/SnackbarContainer'
import DialogContainer from './components/DialogContainer'
import SharingDialogContainer from './components/SharingDialogContainer'

import HeaderBar from '@dhis2/ui/widgets/HeaderBar'
import i18n from '@dhis2/d2-i18n'

import 'typeface-roboto'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

/**
 * Main Component. Renders a AppWithD2ContextAndTheme wrapped in a Provider containing the HeaderBar,
 * Router, SectionLoader, and various popups
 * @param {Object} props
 * @param {Object} props.d2 - The d2 instance to pass to the Headerbar and AppWithD2ContextAndTheme
 * @class
 */
const App = ({ d2 }) => (
    <Provider store={store}>
        <AppWithD2ContextAndTheme d2={d2}>
            <div>
                <HeaderBar appName={i18n.t('User management')} />
                <Router history={history} hashType={'noslash'}>
                    <SectionLoader />
                </Router>
                <SnackbarContainer />
                <DialogContainer />
                <SharingDialogContainer />
            </div>
        </AppWithD2ContextAndTheme>
    </Provider>
)

App.propTypes = {
    d2: PropTypes.object.isRequired,
}

export default App
