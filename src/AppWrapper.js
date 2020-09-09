import React from 'react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { Provider } from 'react-redux'

import api from './api'
import App from './App'
import store from './store'
import AppWithD2ContextAndTheme from './components/AppWithD2ContextAndTheme'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './styles/styles.css'
import { CircularProgress } from 'material-ui'

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
            <AppWithD2ContextAndTheme>
                <div className="page-loader-wrap">
                    <CircularProgress size={48} />
                </div>
            </AppWithD2ContextAndTheme>
        )
    }

    return (
        <Provider store={store}>
            <AppWithD2ContextAndTheme d2={d2}>
                <App />
            </AppWithD2ContextAndTheme>
        </Provider>
    )
}

export default AppWrapper
