import React from 'react'

import { Router } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import history from './utils/history'
import SectionLoader from './components/SectionLoader'
import SnackbarContainer from './components/SnackbarContainer'
import DialogContainer from './components/DialogContainer'
import SharingDialogContainer from './components/SharingDialogContainer'
import theme from '@dhis2/d2-ui-core/theme/theme'

/**
 * Main Component
 * @class
 */
const App = () => (
    <MuiThemeProvider muiTheme={theme}>
        <div>
            <Router history={history} hashType={'noslash'}>
                <SectionLoader />
            </Router>
            <SnackbarContainer />
            <DialogContainer />
            <SharingDialogContainer />
        </div>
    </MuiThemeProvider>
)

export default App
