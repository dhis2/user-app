import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import listReducer from './reducers/list';
import filterReducer from './reducers/filter';
import pagerReducer from './reducers/pager';
import currentItemReducer from './reducers/currentItem';

let middlewares = [ReduxThunk];

const shouldLog = false;

if (process.env.NODE_ENV === 'development' && shouldLog) {
    middlewares.push(logger);
}

const rootReducer = combineReducers({
    list: listReducer,
    filter: filterReducer,
    pager: pagerReducer,
    currentItem: currentItemReducer,
});

export default createStore(rootReducer, applyMiddleware(...middlewares));
