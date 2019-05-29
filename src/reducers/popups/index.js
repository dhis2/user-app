import { combineReducers } from 'redux'
import snackbarReducer from './snackbar'
import dialogReducer from './dialog'
import sharingReducer from './sharing'

/**
 * @module reducers/popups
 */
const popupsReducer = combineReducers({
    snackbar: snackbarReducer,
    dialog: dialogReducer,
    sharing: sharingReducer,
})

export default popupsReducer
