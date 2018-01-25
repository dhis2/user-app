import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import listReducer from './reducers/list';
import filterReducer from './reducers/filter';
import pagerReducer from './reducers/pager';
import logger from 'redux-logger';

let middlewares = [ReduxThunk];

const shouldLog = true;

if (process.env.NODE_ENV === 'development' && shouldLog) {
    middlewares.push(logger);
}

const rootReducer = combineReducers({
    list: listReducer,
    filter: filterReducer,
    pager: pagerReducer,
});

export default createStore(rootReducer, applyMiddleware(...middlewares));
