import React from 'react'
import { Router } from 'react-router-dom'
import DialogContainer from './components/DialogContainer'
import SectionLoader from './components/SectionLoader'
import SharingDialogContainer from './components/SharingDialogContainer'
import SnackbarContainer from './components/SnackbarContainer'
import history from './utils/history'

/**
 * Main Component
 * @class
 */
const App = () => (
    <>
        <Router history={history} hashType={'noslash'}>
            <SectionLoader />
        </Router>
        <SnackbarContainer />
        <DialogContainer />
        <SharingDialogContainer />
    </>
)

export default App
