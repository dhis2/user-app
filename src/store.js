import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import currentItemReducer from './reducers/currentItem.js'
import currentUserReducer from './reducers/currentUser.js'
import filterReducer from './reducers/filter.js'
import listReducer from './reducers/list.js'
import pagerReducer from './reducers/pager.js'
import popupsReducer from './reducers/popups/index.js'

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
})

export default createStore(rootReducer, applyMiddleware(...middlewares))
