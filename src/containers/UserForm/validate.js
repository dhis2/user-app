import i18n from '@dhis2/d2-i18n';
import checkPasswordForErrors from '../../utils/checkPasswordForErrors';
import {
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    EMAIL,
    WHATS_APP,
    ASSIGNED_ROLES,
} from './config';

const CREATE_REQUIRED_FIELDS = [USERNAME, PASSWORD, REPEAT_PASSWORD, SURNAME, FIRST_NAME];
const INVITE_REQUIRED_FIELDS = [EMAIL, SURNAME, FIRST_NAME];
const EDIT_REQUIRED_FIELDS = [SURNAME, FIRST_NAME];

const EMAIL_ADDRESS_PATTERN = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const INTERNATIONAL_PHONE_NUMBER_PATTERN = /^\+(?:[0-9].?){4,14}[0-9]$/;

export default function validate(values, props) {
    const { pristine, inviteUser } = props;
    let errors = {};

    if (pristine) {
        return errors;
    }

    const editUser = props.user.id;
    const requiredFields = editUser
        ? EDIT_REQUIRED_FIELDS
        : inviteUser
            ? INVITE_REQUIRED_FIELDS
            : CREATE_REQUIRED_FIELDS;

    requiredFields.forEach(fieldName =>
        validateRequiredField(errors, fieldName, values[fieldName], editUser)
    );

    if (!editUser && !errors[USERNAME]) {
        validateUsername(errors, values[USERNAME]);
    }

    validateWhatsApp(errors, values[WHATS_APP]);
    validateAssignedRoles(errors, values[ASSIGNED_ROLES], editUser);
    validatePassword(errors, values, editUser, inviteUser);
    validateEmail(errors, values[EMAIL]);
    return errors;
}

function validateRequiredField(errors, propName, value, editUser) {
    if ((!editUser && !value) || (editUser && value === '')) {
        errors[propName] = i18n.t('This field is required');
    }
}

export function validateUsername(errors, username) {
    if (username && username.length < 2) {
        errors[USERNAME] = i18n.t('A username should be at least 2 characters long');
    }

    if (username && username.length > 140) {
        errors[USERNAME] = i18n.t('Username may not exceed 140 characters');
    }
}
function validateWhatsApp(errors, whatsAppValue) {
    if (whatsAppValue && !INTERNATIONAL_PHONE_NUMBER_PATTERN.test(whatsAppValue)) {
        errors[WHATS_APP] = i18n.t(
            'Please provide a valid international phone number (+0123456789)'
        );
    }
}

function validateAssignedRoles(errors, value, editUser) {
    const unTouchedOnEdit = editUser && !value;
    const isArrayWithLength = Array.isArray(value) && value.length > 0;

    if (!unTouchedOnEdit && !isArrayWithLength) {
        errors[ASSIGNED_ROLES] = i18n.t('A user should have at least one User Role');
    }
}

function validatePassword(errors, values, editUser, inviteUser) {
    // Only skip on when editing user and both fields are blank
    const emptyOnEdit = editUser && !values[PASSWORD] && !values[REPEAT_PASSWORD];

    if (emptyOnEdit || inviteUser) {
        return;
    }

    const passwordError = checkPasswordForErrors(values[PASSWORD]);
    if (passwordError) {
        errors[PASSWORD] = passwordError;
    }

    if (values[REPEAT_PASSWORD] !== values[PASSWORD]) {
        errors[REPEAT_PASSWORD] = i18n.t('Passwords do not match');
    }
}

function validateEmail(errors, value) {
    if (value && !EMAIL_ADDRESS_PATTERN.test(value)) {
        errors[EMAIL] = i18n.t('Please provide a valid email address');
    }
}
