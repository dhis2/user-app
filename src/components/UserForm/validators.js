import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import pDebounce from 'p-debounce'
import { useValidator } from '../../hooks/useValidator'

export const useDebouncedUniqueUsernameValidator = ({
    username: currentUsername,
}) => {
    const engine = useDataEngine()
    const findUserByUsername = pDebounce(async (username) => {
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
    const validator = async (username) => {
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
    return useValidator(validator)
}

export const createRepeatPasswordValidator = (password) => (repeatPassword) => {
    if (password && password !== repeatPassword) {
        return i18n.t('Passwords do not match')
    }
}

export const hasSelectionValidator = (value) => {
    if (!Array.isArray(value) || value.length === 0) {
        return i18n.t('Please provide a value')
    }
}
