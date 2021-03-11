import { createStore, applyMiddleware, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import currentItemReducer from './reducers/currentItem'
import currentUserReducer from './reducers/currentUser'
import filterReducer from './reducers/filter'
import listReducer from './reducers/list'
import pagerReducer from './reducers/pager'
import popupsReducer from './reducers/popups/'

const middlewares = [ReduxThunk]

const shouldLog = false

if (process.env.NODE_ENV === 'development' && shouldLog) {
    middlewares.push(logger)
}

const rootReducer = combineReducers({
    list: listReducer,
    filter: filterReducer,
    pager: pagerReducer,
    currentItem: currentItemReducer,
    currentUser: currentUserReducer,
    popups: popupsReducer,
    form: formReducer,
})

export default createStore(rootReducer, applyMiddleware(...middlewares))
