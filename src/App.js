import React from 'react'
import { Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import SectionLoader from './components/SectionLoader'
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
    </>
)

export default App
