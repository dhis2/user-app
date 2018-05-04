import api from '../api';

/**
 * Receives a full UTC data string and return a formatted version according to the user's locale
 * @param {String} utcString - UTC Date String
 * @returns {String} Formatted date string
 * @memberof module:utils
 * @function
 */
const parseDateFromUTCString = utcString => {
    const d2 = api.getD2();
    const locale = d2.currentUser.userSettings.settings.keyUiLocale;
    const date = new Date(utcString);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
};

export default parseDateFromUTCString;
