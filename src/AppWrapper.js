import './locales/index.js'

import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { Provider } from 'react-redux'
import App from './App.js'
import { CurrentUserProvider } from './components/CurrentUserProvider.js'
import store from './store.js'

const AppWrapper = () => (
    <Provider store={store}>
        <CurrentUserProvider>
            <CssVariables spacers colors theme />
            <App />
        </CurrentUserProvider>
    </Provider>
)

export default AppWrapper
