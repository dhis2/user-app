import api from '../api';
import _ from '../constants/lodash';

export const parseDateFromUTCString = utcString => {
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

export const translate = key => {
    const d2 = api.getD2();
    return d2.i18n.getTranslation(_.snakeCase(key));
};
