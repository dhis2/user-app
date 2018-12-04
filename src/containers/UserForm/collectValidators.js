import * as validators from '../../utils/validators';
import {
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    EMAIL,
} from './config';

// Use this to make sure validator names match form field names (see const fieldSpecificValidator)
const validatorLookup = {
    ...validators,
    userRoles: validators.requiredArray,
};

const CREATE_REQUIRED_FIELDS = new Set([
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
]);
const INVITE_REQUIRED_FIELDS = new Set([EMAIL, SURNAME, FIRST_NAME]);
const EDIT_REQUIRED_FIELDS = new Set([SURNAME, FIRST_NAME]);

export default function collectValidators(
    props,
    name,
    isRequiredField,
    isAttributeField,
    fieldValidators
) {
    const validatorsToApply = [];
    const isEditingUser = Boolean(props.user.id);
    const isRequiredAttributeField = isAttributeField && isRequiredField;
    const fieldSpecificValidator = validatorLookup[name];
    const isRequiredStaticField =
        !isAttributeField && isEditingUser
            ? EDIT_REQUIRED_FIELDS.has(name)
            : props.inviteUser
                ? INVITE_REQUIRED_FIELDS.has(name)
                : CREATE_REQUIRED_FIELDS.has(name);

    if (fieldSpecificValidator) {
        validatorsToApply.push(fieldSpecificValidator);
    }

    if (isRequiredAttributeField || isRequiredStaticField) {
        validatorsToApply.push(validators.required);
    }

    if (isAttributeField && fieldValidators) {
        validatorsToApply.push(...fieldValidators);
    }

    return validatorsToApply;
}
