import i18n from '@dhis2/d2-i18n'
import pDebounce from 'p-debounce'
import { useCallback } from 'react'

export const useDebouncedUniqueUsernameValidator = ({ engine }) => {
    const validator = async username => {
        try {
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
            if (users.length > 0) {
                return i18n.t('Username already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this username'
            )
        }
    }
    const debouncedValidator = pDebounce(validator, 350)
    return useCallback(debouncedValidator, [])
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
