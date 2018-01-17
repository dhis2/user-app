import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';

let middlewares = [];

if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
}

const rootReducer = combineReducers({});

export default createStore(rootReducer, applyMiddleware(...middlewares));
