import i18n from 'd2-i18n';
import _ from '../../constants/lodash';
import checkPasswordForErrors from '../../utils/checkPasswordForErrors';
import {
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    EMAIL,
    ASSIGNED_ROLES,
} from './config';

const CREATE_REQUIRED_FIELDS = [
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
];

const EDIT_REQUIRED_FIELDS = [SURNAME, FIRST_NAME];

export default function validate(values, props) {
    const { pristine } = props;
    let errors = {};

    if (pristine) {
        return errors;
    }

    const createUser = !props.user.id;
    const requiredFields = createUser
        ? CREATE_REQUIRED_FIELDS
        : EDIT_REQUIRED_FIELDS;

    requiredFields.forEach(fieldName =>
        validateRequiredField(errors, fieldName, values[fieldName], createUser)
    );

    validateAssignedRoles(errors, values[ASSIGNED_ROLES], createUser);
    validatePassword(errors, values, createUser);
    validateEmail(errors, values[EMAIL]);
    return errors;
}

function validateRequiredField(errors, propName, value, createUser) {
    if ((createUser && !value) || (!createUser && value === '')) {
        errors[propName] = i18n.t('This field is required');
    }
}

function validateAssignedRoles(errors, value, createUser) {
    const unTouchedOnEdit = !createUser && !value;
    const isArrayWithLength = _.isArray(value) && value.length > 0;

    if (!unTouchedOnEdit && !isArrayWithLength) {
        errors[ASSIGNED_ROLES] = i18n.t(
            'A user should have at least one User Role'
        );
    }
}

function validatePassword(errors, values, createUser) {
    const skipValidation =
        !createUser && !values[PASSWORD] && !values[REPEAT_PASSWORD];

    if (skipValidation) {
        return;
    }

    const passwordError =
        values[PASSWORD] && checkPasswordForErrors(values[PASSWORD]);
    if (passwordError) {
        errors[PASSWORD] = passwordError;
    }

    if (
        values[REPEAT_PASSWORD] &&
        values[REPEAT_PASSWORD] !== values[PASSWORD]
    ) {
        errors[REPEAT_PASSWORD] = i18n.t('Passwords do not match');
    }
}

function validateEmail(errors, value) {
    const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (value && !emailPattern.test(value)) {
        errors[EMAIL] = i18n.t('Please provide a valid email address');
    }
}
