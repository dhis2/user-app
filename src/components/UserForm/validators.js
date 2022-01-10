import i18n from '@dhis2/d2-i18n'

// TODO: implement debounce (see https://codesandbox.io/s/mmywp9jl1y?file=/DebouncingValidatingField.js)
export const makeUniqueUsernameValidator = engine => async username => {
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
