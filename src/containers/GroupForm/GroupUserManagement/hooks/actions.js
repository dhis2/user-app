import {
    SET_FILTER_STATUS,
    SET_FILTER_STRING,
    SET_SELECTED_USERS,
    SET_PAGE,
} from './actionTypes.js'

export default function createActions(dispatch) {
    return {
        setFilterStatus: status => {
            dispatch({ type: SET_FILTER_STATUS, payload: status })
        },
        setFilterString: str => {
            dispatch({ type: SET_FILTER_STRING, payload: str })
        },
        setSelectedUsers: userIds => {
            dispatch({ type: SET_SELECTED_USERS, payload: userIds })
        },
        setPage: page => {
            dispatch({ type: SET_PAGE, payload: page })
        },
    }
}
