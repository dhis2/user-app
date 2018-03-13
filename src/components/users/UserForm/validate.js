import _ from '../../../constants/lodash';
import { checkPasswordForErrors } from '../../../utils';
import {
    USERNAME,
    EXTERNAL_AUTH,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    EMAIL,
    OPEN_ID,
    LDAP_ID,
    PHONE_NUMBER,
    INTERFACE_LANGUAGE,
    DATABASE_LANGUAGE,
    ASSIGNED_ROLES,
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
    ASSIGNED_USER_GROUPS,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
} from './config';

const CREATE_REQUIRED_FIELDS = [
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    ASSIGNED_ROLES,
];

const EDIT_REQUIRED_FIELDS = [SURNAME, FIRST_NAME, ASSIGNED_ROLES];

export default function validate(values, props) {
    const { pristine } = props;
    let errors = {};

    if (pristine) {
        return errors;
    }

    const createUser = !props.user.id;
    const requiredFields = createUser ? CREATE_REQUIRED_FIELDS : EDIT_REQUIRED_FIELDS;
    const requiredFieldValidator = createUser ? valueIsRequired : valueMayNotBeEmpty;

    requiredFields.forEach(fieldName =>
        requiredFieldValidator(errors, fieldName, values[fieldName])
    );

    validatePassword(errors, values, createUser);

    validateEmail(errors, values[EMAIL]);

    return errors;
}

function validatePassword(errors, values, createUser) {
    const skipValidation = !createUser && !values[PASSWORD] && !values[REPEAT_PASSWORD];

    if (skipValidation) {
        return;
    }

    const passwordError = values[PASSWORD] && checkPasswordForErrors(values[PASSWORD]);
    if (passwordError) {
        errors[PASSWORD] = passwordError;
    }

    if (values[REPEAT_PASSWORD] && values[REPEAT_PASSWORD] !== values[PASSWORD]) {
        errors[REPEAT_PASSWORD] = 'Passwords do not match';
    }
}

function valueIsRequired(errors, propName, value) {
    if (!value) {
        errors[propName] = 'Required field';
    }
}

function valueMayNotBeEmpty(errors, propName, value) {
    if (value === '') {
        errors[propName] = 'Required field';
    }
}

function validateEmail(errors, value) {
    const emailPattern = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (value && !emailPattern.test(value)) {
        errors[EMAIL] = 'Please provide a valid email';
    }
}
