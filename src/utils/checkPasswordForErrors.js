import i18n from '@dhis2/d2-i18n';

/**
 * Tests if a given password is compliant with the password restrictions. This function checks all restrictions below, but returns when the first violation was found:
 * - At least 8 characters
 * - No more than 34 characters
 * - Contains at least 1 lowercase character
 * - Contains at least 1 UPPERCASE character
 * - Contains at least 1 number
 * - Contains at least 1 special character
 * @param {String} password
 * @return {null|String} Null if password is OK, otherwise an error message
 * @memberof module:utils
 * @function
 */
const checkPasswordForErrors = password => {
    const lowerCase = /^(?=.*[a-z]).+$/;
    const upperCase = /^(?=.*[A-Z]).+$/;
    const digit = /^(?=.*[0-9]).+$/;
    const specialChar = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/;

    if (!password) {
        return i18n.t('This field is required');
    }
    if (password.length < 8) {
        return i18n.t('Password should be at least 8 characters long');
    }
    if (password.length > 35) {
        return i18n.t('Password should be no longer than 34 characters');
    }
    if (!lowerCase.test(password)) {
        return i18n.t('Password should contain at least one lowercase letter');
    }
    if (!upperCase.test(password)) {
        return i18n.t('Password should contain at least one UPPERCASE letter');
    }
    if (!digit.test(password)) {
        return i18n.t('Password should contain at least one number');
    }
    if (!specialChar.test(password)) {
        return i18n.t('Password should have at least one special character');
    }

    return null;
};

export default checkPasswordForErrors;
