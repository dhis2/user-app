import i18n from '@dhis2/d2-i18n';
import checkPasswordForErrors from '../../utils/checkPasswordForErrors';
import {
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    EMAIL,
} from './config';

const CREATE_REQUIRED_FIELDS = new Set([
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
]);
const INVITE_REQUIRED_FIELDS = new Set([EMAIL, SURNAME, FIRST_NAME]);
const EDIT_REQUIRED_FIELDS = new Set([SURNAME, FIRST_NAME]);

const EMAIL_ADDRESS_PATTERN = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const fieldSpecificValidatorLookup = {
    username,
    userRoles,
    password,
    email,
};

export default function collectValidators(
    props,
    name,
    isRequiredField,
    isAttributeField,
    fieldValidators
) {
    const validators = [];
    const isEditingUser = Boolean(props.user.id);
    const isRequiredAttributeField = isAttributeField && isRequiredField;
    const fieldValidator = fieldSpecificValidatorLookup[name];
    const isRequiredStaticField =
        !isAttributeField && isEditingUser
            ? EDIT_REQUIRED_FIELDS.has(name)
            : props.inviteUser
                ? INVITE_REQUIRED_FIELDS.has(name)
                : CREATE_REQUIRED_FIELDS.has(name);

    if (fieldValidator) {
        validators.push(fieldValidator);
    }

    if (isRequiredAttributeField || isRequiredStaticField) {
        validators.push(required);
    }

    if (isAttributeField && fieldValidators) {
        validators.push(...fieldValidators);
    }

    return validators;
}

function required(value) {
    return !Boolean(value) ? i18n.t('This field is required') : undefined;
}

function username(value) {
    if (value && value.length < 2) {
        return i18n.t('A username should be at least 2 characters long');
    }

    if (value && value.length > 140) {
        return i18n.t('Username may not exceed 140 characters');
    }
}

export function number(value) {
    if (isNaN(value)) {
        return i18n.t('Value should be a number');
    }
}

export function integer(value) {
    if (!isInteger(value)) {
        return i18n.t('Value should be an integer');
    }
}

export function positiveInteger(value) {
    if (!isInteger(value) || parseInt(value, 10) <= 0) {
        return i18n.t('Value should be a positive integer');
    }
}

export function negativeInteger(value) {
    if (!isInteger(value) || parseInt(value, 10) >= 0) {
        return i18n.t('Value should be a nagative integer');
    }
}

function userRoles(value, _, props) {
    const isEditingUser = Boolean(props.user.id);
    const unTouchedOnEdit = isEditingUser && !value;
    const isArrayWithLength = Array.isArray(value) && value.length > 0;

    if (!unTouchedOnEdit && !isArrayWithLength) {
        return i18n.t('A user should have at least one User Role');
    }
}

function password(value, allValues, props, name) {
    // Only skip on when editing user and both fields are blank
    const isEditingUser = Boolean(props.user.id);
    const emptyOnEdit =
        isEditingUser && !allValues[PASSWORD] && !allValues[REPEAT_PASSWORD];

    if (emptyOnEdit || props.inviteUser) {
        return;
    }

    const passwordError = checkPasswordForErrors(allValues[PASSWORD]);
    if (passwordError) {
        return passwordError;
    }

    if (name === REPEAT_PASSWORD && allValues[REPEAT_PASSWORD] !== allValues[PASSWORD]) {
        return i18n.t('Passwords do not match');
    }
}

function email(value) {
    if (value && !EMAIL_ADDRESS_PATTERN.test(value)) {
        return i18n.t('Please provide a valid email address');
    }
}

// LEGACY EXPORT STILL BEING USED BY OTHER COMPONENT, SHOULD BE REFACTORED AWAY
export function validateUsername(errors, username) {
    if (username && username.length < 2) {
        errors[USERNAME] = i18n.t('A username should be at least 2 characters long');
    }

    if (username && username.length > 140) {
        errors[USERNAME] = i18n.t('Username may not exceed 140 characters');
    }
}

// Helper
function isInteger(value) {
    if (isNaN(value)) {
        return false;
    }
    const x = parseFloat(value);
    return (x | 0) === x;
}
