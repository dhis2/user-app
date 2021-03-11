import { combineReducers } from 'redux'
import dialogReducer from './dialog'
import sharingReducer from './sharing'
import snackbarReducer from './snackbar'

/**
 * @module reducers/popups
 */
const popupsReducer = combineReducers({
    snackbar: snackbarReducer,
    dialog: dialogReducer,
    sharing: sharingReducer,
})

export default popupsReducer
