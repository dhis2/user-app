import { SHOW_DIALOG, HIDE_DIALOG } from '../../constants/actionTypes.js'
import { INITIAL_DIALOG_STATE } from '../../constants/defaults.js'

/**
 * Reducer to show / hide the DialogContainer
 * @memberof module:reducers/popups
 * @param {Object} state
 * @param {Boolean} state.show=false - Flag to show or hide the dialog
 * @param {Object} state.props={} - Props to pass to the MUI Dialog component
 * @param {Object|null} state.content=null - The content to be rendered by the MUI Dialog component
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object} action.payload - The content and props for the new state
 * @returns {Object} - A new state object
 * @function
 */
const dialogReducer = (state = INITIAL_DIALOG_STATE, { type, payload }) => {
    switch (type) {
        case SHOW_DIALOG:
            return {
                show: true,
                ...payload,
            }
        case HIDE_DIALOG:
            return { ...INITIAL_DIALOG_STATE }
        default:
            return state
    }
}

export default dialogReducer
