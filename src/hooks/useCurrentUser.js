import { useSelector } from 'react-redux'
import * as actions from '../actions/index.js'
import store from '../store.js'

export const useCurrentUser = () => {
    const currentUser = useSelector(({ currentUser }) => currentUser)

    return {
        currentUser,
        refreshCurrentUser: () => {
            store.dispatch(actions.refreshCurrentUser())
        },
    }
}
