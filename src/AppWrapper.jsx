import './locales/index.js'

import { CssVariables } from '@dhis2/ui'
import React from 'react'
import App from './App.jsx'
import { CurrentUserProvider } from './providers/current-user/CurrentUserProvider.jsx'
import { ReferrerProvider, SystemProvider } from './providers/index.js'

const AppWrapper = () => (
    <CurrentUserProvider>
        <ReferrerProvider>
            <SystemProvider>
                <CssVariables spacers colors theme />
                <App />
            </SystemProvider>
        </ReferrerProvider>
    </CurrentUserProvider>
)

export default AppWrapper
