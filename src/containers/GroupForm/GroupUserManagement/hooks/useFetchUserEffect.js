import { useEffect } from 'react'
import api from '../../../../api/index.js'
import { LOADING, USERS_RECEIVED, USER_ERRORED } from './actionTypes.js'
import { STATUS_MEMBER, STATUS_NON_MEMBER } from '../StatusSelect.js'

export default function useFetchUserEffect({
    id,
    dispatch,
    page,
    filterStr,
    filterStatus,
}) {
    useEffect(() => {
        dispatch({ type: LOADING })
        const filter = []

        if (filterStr) {
            filter.push(`identifiable:token:${filterStr}`)
        }

        if (filterStatus === STATUS_MEMBER) {
            filter.push(`userGroups.id:in:[${id}]`)
        } else if (filterStatus === STATUS_NON_MEMBER) {
            filter.push(`userGroups.id:!in:[${id}]`)
        }

        api.getUserGroupUsers(page, filter)
            .then(({ pager, users }) => {
                dispatch({
                    type: USERS_RECEIVED,
                    payload: {
                        pager,
                        users: users.map(user => ({
                            displayName: user.displayName,
                            id: user.id,
                            username: user.userCredentials.username,
                        })),
                    },
                })
            })
            .catch(error => {
                dispatch({ type: USER_ERRORED, payload: error })
            })
    }, [page, filterStr, filterStatus])
}
