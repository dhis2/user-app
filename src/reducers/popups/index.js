import { combineReducers } from 'redux'
import dialogReducer from './dialog.js'
import sharingReducer from './sharing.js'
import snackbarReducer from './snackbar.js'

/**
 * @module reducers/popups
 */
const popupsReducer = combineReducers({
    snackbar: snackbarReducer,
    dialog: dialogReducer,
    sharing: sharingReducer,
})

export default popupsReducer
