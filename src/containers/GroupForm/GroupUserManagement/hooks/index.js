import { useRouteMatch } from 'react-router'
import { useReducer } from 'react'
import reducer from './reducer.js'
import createActions from './actions.js'
import useFetchUserEffect from './useFetchUserEffect.js'

export default function useGroupUserManagerState(initialState) {
    const {
        params: { id },
    } = useRouteMatch()
    const [state, dispatch] = useReducer(reducer, initialState)
    const { page, filterStr, filterStatus } = state

    useFetchUserEffect({ dispatch, page, filterStr, filterStatus, id })

    return {
        state,
        actions: createActions(dispatch),
    }
}
