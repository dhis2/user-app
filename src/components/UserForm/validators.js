import i18n from '@dhis2/d2-i18n'
import { memoize } from 'lodash-es'
import pDebounce from 'p-debounce'
import { useCallback } from 'react'

export const useDebouncedUniqueUsernameValidator = ({
    engine,
    username: currentUsername,
}) => {
    const findUserByUsername = pDebounce(async username => {
        const {
            users: { users },
        } = await engine.query({
            users: {
                resource: 'users',
                params: {
                    filter: `userCredentials.username:eq:${username}`,
                    fields: 'id',
                },
            },
        })
        return users[0]
    }, 350)
    const validator = async username => {
        if (username === currentUsername) {
            return
        }

        try {
            const user = await findUserByUsername(username)
            if (user) {
                return i18n.t('Username already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this username'
            )
        }
    }
    // Memoize validator as react final form reruns all validators when any field changes
    // See https://github.com/final-form/react-final-form/issues/292
    return useCallback(memoize(validator), [])
}

export const createRepeatPasswordValidator = password => repeatPassword => {
    if (password && password !== repeatPassword) {
        return i18n.t('Passwords do not match')
    }
}

export const hasSelectionValidator = value => {
    if (!Array.isArray(value) || value.length === 0) {
        return i18n.t('Please provide a value')
    }
}
