import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../../constants/actionTypes.js'
import { INITIAL_SNACKBAR_STATE } from '../../constants/defaults.js'

/**
 * Reducer to show / hide the SnackbarContainer
 * @memberof module:reducers/popups
 * @param {Object} state
 * @param {Boolean} state.show=false - Flag to show or hide the Snackbar
 * @param {Object} state.props={message:''} - Props to pass to the MUI Snackbar component
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object} action.payload - Props for the new state
 * @returns {Object} - A new state object
 * @function
 */
const snackbarReducer = (state = INITIAL_SNACKBAR_STATE, { type, payload }) => {
    switch (type) {
        case SHOW_SNACKBAR:
            return {
                show: true,
                props: payload,
            }
        case HIDE_SNACKBAR:
            return { ...INITIAL_SNACKBAR_STATE }
        default:
            return state
    }
}

export default snackbarReducer
