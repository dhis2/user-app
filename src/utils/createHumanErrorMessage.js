import i18n from '@dhis2/d2-i18n'
/**
 * It is preffered to show the error message from the server it is a 401-499 code
 * @param {Object} error - The error object
 * @param {Number} error.httpStatusCode - The error status code
 * @param {Number} error.message - The error message
 * @param {String} fallbackMsg - The message to show in case the actual message is
 * likely to be useless for normal users
 * @memberof module:utils
 * @function
 */
const fallBackDefault = i18n.t(
    'Something went wrong when processing your request.'
)

const createHumanErrorMessage = (
    { message, messages, httpStatusCode },
    fallbackMsg = fallBackDefault
) => {
    const useMessage =
        (httpStatusCode && httpStatusCode >= 400 && httpStatusCode < 500) ||
        (!httpStatusCode && messages && messages.length > 0)

    if (!message && messages && messages.length > 0) {
        message = messages.map(({ message }) => message).join(', ')
    }

    return useMessage ? message : fallbackMsg
}

export default createHumanErrorMessage
