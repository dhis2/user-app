import React from 'react'
import { Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import SectionNavigation from './components/SectionNavigation.js'
import history from './utils/history.js'

/**
 * Main Component
 * @class
 */
const App = () => (
    <Router history={history} hashType={'noslash'}>
        <QueryParamProvider ReactRouterRoute={Route}>
            <SectionNavigation />
        </QueryParamProvider>
    </Router>
)

export default App
