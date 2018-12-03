import i18n from '@dhis2/d2-i18n';
import { PASSWORD, REPEAT_PASSWORD } from '../containers/UserForm/config';

const EMAIL_ADDRESS_PATTERN = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const INTERNATIONAL_PHONE_NUMBER_PATTERN = /^\+(?:[0-9].?){4,14}[0-9]$/;

// validators (ordered alphabetically)
export function code(value) {
    if (value && value.length > 50) {
        return i18n.t('Exceeds maximum character limit of 50');
    }
}

export function email(value) {
    if (value && !EMAIL_ADDRESS_PATTERN.test(value)) {
        return i18n.t('Please provide a valid email address');
    }
}

export function integer(value) {
    if (!isInteger(value)) {
        return i18n.t('Value should be an integer');
    }
}

export function negativeInteger(value) {
    if (!isInteger(value) || parseInt(value, 10) >= 0) {
        return i18n.t('Value should be a nagative integer');
    }
}

export function number(value) {
    if (isNaN(value)) {
        return i18n.t('Value should be a number');
    }
}

export function password(value, allValues, props) {
    if (!shouldValidatePassword(allValues, props)) {
        return undefined;
    }
    const passwordError = checkPasswordForErrors(allValues[PASSWORD]);
    if (passwordError) {
        return passwordError;
    }
}

export function positiveInteger(value) {
    if (!isInteger(value) || parseInt(value, 10) <= 0) {
        return i18n.t('Value should be a positive integer');
    }
}

export function repeatPassword(value, allValues) {
    if (allValues[REPEAT_PASSWORD] !== allValues[PASSWORD]) {
        return i18n.t('Passwords do not match');
    }
}

export function required(value) {
    return !Boolean(value) ? i18n.t('This field is required') : undefined;
}

export function requiredArray(value) {
    if (!(Array.isArray(value) && value.length > 0)) {
        return i18n.t('Dit is echt erg');
    }
}

export function username(value) {
    if (value && value.length < 2) {
        return i18n.t('A username should be at least 2 characters long');
    }

    if (value && value.length > 140) {
        return i18n.t('Username may not exceed 140 characters');
    }
}

export function whatsApp(value) {
    if (value && !INTERNATIONAL_PHONE_NUMBER_PATTERN.test(value)) {
        return i18n.t('Please provide a valid international phone number (+0123456789)');
    }
}

// Helpers
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
function checkPasswordForErrors(password) {
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
}

function isInteger(value) {
    if (isNaN(value)) {
        return false;
    }
    const x = parseFloat(value);
    return (x | 0) === x;
}

function shouldValidatePassword(allValues, props) {
    if (props.inviteUser) {
        return false;
    }

    const isEditingUser = Boolean(props.user.id);
    const isEmptyOnEdit =
        isEditingUser && !allValues[PASSWORD] && !allValues[REPEAT_PASSWORD];

    return isEmptyOnEdit ? false : true;
}
