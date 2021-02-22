import * as ACTIONS from './actionTypes.js'

export default function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SET_FILTER_STATUS:
            return {
                ...state,
                page: 1,
                filterStatus: payload,
            }
        case ACTIONS.SET_FILTER_STRING:
            return {
                ...state,
                page: 1,
                filterStr: payload,
            }
        case ACTIONS.SET_SELECTED_USERS:
            return {
                ...state,
                selectedUsers: payload,
            }
        case ACTIONS.SET_PAGE:
            return {
                ...state,
                page: payload,
            }
        case ACTIONS.LOADING:
            return {
                ...state,
                data: {},
                error: null,
                loading: true,
                selectedUsers: [],
            }
        case ACTIONS.USERS_RECEIVED:
            return {
                ...state,
                data: payload,
                error: null,
                loading: false,
            }
        case ACTIONS.USER_ERRORED:
            return {
                ...state,
                data: {},
                error: payload,
                loading: false,
            }
        default:
            return state
    }
}
