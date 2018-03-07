import api from '../api';
import i18next from 'i18next';
import history from './history';

export const navigateTo = path => {
    history.push(path);
};

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

export const checkPasswordForErrors = password => {
    const upperCase = /^(?=.*[A-Z]).+$/;
    const digit = /^(?=.*[0-9]).+$/;
    const specialChar = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/;

    if (password.length < 8) {
        return i18next.t('Password should be at least 8 characters long');
    }
    if (password.length > 35) {
        return i18next.t('Password should be no longer than 34 characters');
    }
    if (!upperCase.test(password)) {
        return i18next.t('Password should contain at least one UPPERCASE letter');
    }
    if (!digit.test(password)) {
        return i18next.t('Password should contain at least one number');
    }
    if (!specialChar.test(password)) {
        return i18next.t('Password should have at least one special character');
    }

    return null;
};

export const asArray = object => {
    return typeof object.toArray === 'function' ? object.toArray() : object;
};

export const getNestedProp = (propertyPathStr, parent) => {
    return propertyPathStr.split('.').reduce((currentLevel, propName) => {
        return currentLevel && currentLevel[propName] ? currentLevel[propName] : null;
    }, parent);
};
