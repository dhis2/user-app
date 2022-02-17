import { useSelector } from 'react-redux'
import * as actions from '../actions'
import store from '../store'

export const useCurrentUser = () => {
    const currentUser = useSelector(({ currentUser }) => currentUser)

    return {
        currentUser,
        refreshCurrentUser: () => {
            store.dispatch(actions.refreshCurrentUser())
        },
    }
}
