import React from 'react'

import { Router } from 'react-router-dom'

import history from './utils/history'
import SectionLoader from './components/SectionLoader'
import SnackbarContainer from './components/SnackbarContainer'
import DialogContainer from './components/DialogContainer'
import SharingDialogContainer from './components/SharingDialogContainer'

/**
 * Main Component
 * @class
 */
const App = () => (
    <div>
        <Router history={history} hashType={'noslash'}>
            <SectionLoader />
        </Router>
        <SnackbarContainer />
        <DialogContainer />
        <SharingDialogContainer />
    </div>
)

export default App
