import './locales/index.js'

import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CenteredContent, CircularLoader, CssVariables } from '@dhis2/ui'
import React from 'react'
import { Provider } from 'react-redux'
import api from './api'
import App from './App'
import AppWithD2Context from './components/AppWithD2Context'
import store from './store'

const AppWrapper = () => {
    const { d2 } = useD2({
        d2Config: {
            schemas: [
                'userRole',
                'user',
                'userGroup',
                'userCredentials',
                'organisationUnit',
            ],
        },
        i18nRoot: './d2i18n',
        onInitialized: d2 => {
            api.init(d2)
        },
    })

    if (!d2) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <>
            <CssVariables spacers colors theme />
            <Provider store={store}>
                <AppWithD2Context d2={d2}>
                    <App />
                </AppWithD2Context>
            </Provider>
        </>
    )
}

export default AppWrapper
