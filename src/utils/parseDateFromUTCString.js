import i18n from '@dhis2/d2-i18n'

/**
 * Receives a full UTC data string and return a formatted version according to the user's locale
 * @param {String} utcString - UTC Date String
 * @param {String} includeTime - Include time if true
 * @returns {String} Formatted date string
 * @memberof module:utils
 * @function
 */
const parseDateFromUTCString = (utcString, { includeTime = false } = {}) => {
    const date = new Date(utcString)
    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
    }
    const options = includeTime
        ? { ...dateOptions, ...timeOptions }
        : dateOptions

    // Wrap in try/catch in case i18n.language is not valid locale
    try {
        return new Intl.DateTimeFormat(i18n.language, options).format(date)
    } catch (error) {
        return utcString
    }
}

export default parseDateFromUTCString
