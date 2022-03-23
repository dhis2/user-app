import i18n from '@dhis2/d2-i18n'
import { MIN_CHAR_LENGTH } from './constants.js'

const createHumanErrorMessage = (
    { message, messages, httpStatusCode },
    fallbackMsg
) => {
    const fallback =
        fallbackMsg ||
        i18n.t('Something went wrong when processing your request.')
    const useMessage =
        (httpStatusCode && httpStatusCode >= 400 && httpStatusCode < 500) ||
        (!httpStatusCode && messages && messages.length > 0)

    if (!message && messages && messages.length > 0) {
        message = messages.map(({ message }) => message).join(', ')
    }

    return useMessage ? message : fallback
}

const getValidationText = ({
    error,
    fetching,
    organisationUnits,
    searchText,
    waiting,
}) => {
    if (fetching || waiting || searchText.length === 0) {
        return ''
    }

    if (error) {
        console.error(error)
        return createHumanErrorMessage(
            error,
            i18n.t('There was a problem retreiving your search results')
        )
    }

    if (searchText.length < MIN_CHAR_LENGTH) {
        return i18n.t('Please enter at least {{ minCharLength }} characters', {
            minCharLength: MIN_CHAR_LENGTH,
        })
    }

    if (organisationUnits.length === 0) {
        return i18n.t('No matches found')
    }

    return ''
}

export default getValidationText
