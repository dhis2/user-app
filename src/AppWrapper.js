import './locales/index.js'

import { CssVariables } from '@dhis2/ui'
import React from 'react'
import App from './App.js'
import { CurrentUserProvider } from './providers/current-user/CurrentUserProvider.js'
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
