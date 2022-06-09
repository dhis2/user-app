import {
    SHOW_SHARING_DIALOG,
    HIDE_SHARING_DIALOG,
} from '../../constants/actionTypes.js'
import { INITIAL_SHARING_STATE } from '../../constants/defaults.js'

/**
 * Reducer to show / hide the SharingDialogContainer
 * @memberof module:reducers/popups
 * @param {Object} state
 * @param {Boolean} state.show=false - Flag to show or hide the SharingDialog
 * @param {String|null} state.id=null - The model instance ID for which to open the sharing settings
 * @param {String|null} state.type=null - The model instance name
 * @param {Object} action
 * @param {String} action.type - Indicator of action to switch to
 * @param {Object} action.payload - The ID and type for the new state
 * @returns {Object} - A new state object
 * @function
 */
const sharingReducer = (state = INITIAL_SHARING_STATE, { type, payload }) => {
    switch (type) {
        case SHOW_SHARING_DIALOG:
            return {
                show: true,
                ...payload,
            }
        case HIDE_SHARING_DIALOG:
            return { ...INITIAL_SHARING_STATE }
        default:
            return state
    }
}

export default sharingReducer
