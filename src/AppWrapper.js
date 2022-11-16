import './locales/index.js'

import { CssVariables } from '@dhis2/ui'
import React from 'react'
import App from './App.js'
import { CurrentUserProvider } from './components/CurrentUserProvider.js'

const AppWrapper = () => (
    <CurrentUserProvider>
        <CssVariables spacers colors theme />
        <App />
    </CurrentUserProvider>
)

export default AppWrapper
