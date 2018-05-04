import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { reducer as formReducer } from 'redux-form';
import listReducer from './reducers/list';
import filterReducer from './reducers/filter';
import pagerReducer from './reducers/pager';
import currentItemReducer from './reducers/currentItem';
import currentUserReducer from './reducers/currentUser';
import popupsReducer from './reducers/popups/';

let middlewares = [ReduxThunk];

const shouldLog = false;

if (process.env.NODE_ENV === 'development' && shouldLog) {
    middlewares.push(logger);
}

/**
 * @module reducers
 */

const rootReducer = combineReducers({
    list: listReducer,
    filter: filterReducer,
    pager: pagerReducer,
    currentItem: currentItemReducer,
    currentUser: currentUserReducer,
    popups: popupsReducer,
    form: formReducer,
});

export default createStore(rootReducer, applyMiddleware(...middlewares));
