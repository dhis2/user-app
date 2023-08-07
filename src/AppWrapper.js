import './locales/index.js'

import { CssVariables } from '@dhis2/ui'
import React from 'react'
import App from './App.js'
import { CurrentUserProvider } from './components/CurrentUserProvider.js'
import { ReferrerProvider } from './providers/index.js'

const AppWrapper = () => (
    <CurrentUserProvider>
        <ReferrerProvider>
            <CssVariables spacers colors theme />
            <App />
        </ReferrerProvider>
    </CurrentUserProvider>
)

export default AppWrapper
