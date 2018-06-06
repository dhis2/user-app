import api from '../api';

/**
 * Receives a full UTC data string and return a formatted version according to the user's locale
 * @param {String} utcString - UTC Date String
 * @param {String} includeTime - Include time if true
 * @returns {String} Formatted date string
 * @memberof module:utils
 * @function
 */
const parseDateFromUTCString = (utcString, includeTime) => {
    const d2 = api.getD2();
    const locale = d2.currentUser.userSettings.settings.keyUiLocale;
    const date = new Date(utcString);
    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };
    const options = includeTime ? { ...dateOptions, ...timeOptions } : dateOptions;

    return new Intl.DateTimeFormat(locale, options).format(date);
};

export default parseDateFromUTCString;
