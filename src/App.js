import React from 'react'
import { Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
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
            <QueryParamProvider ReactRouterRoute={Route}>
                <SectionLoader />
            </QueryParamProvider>
        </Router>
        <SnackbarContainer />
        <DialogContainer />
        <SharingDialogContainer />
    </>
)

export default App
