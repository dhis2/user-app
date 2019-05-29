/* eslint-disable max-params */

import * as validators from '../../utils/validators'
import {
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
    EMAIL,
} from './config'

// Use this to make sure validator names match form field names (see const fieldSpecificValidator)
const validatorLookup = {
    ...validators,
    userRoles: validators.requiredArray,
}

// When creating a user, a password is required, because there is no step to create
// a password, which a user does get when he is invited by email. On the other hand,
// the email field is optional, because the user can just use his username to login.
// And for this reason, the username field is required too.
const CREATE_REQUIRED_FIELDS = new Set([
    USERNAME,
    PASSWORD,
    REPEAT_PASSWORD,
    SURNAME,
    FIRST_NAME,
])

// When inviting a user, email, firstname and surname is sufficient.
// The user can setup a username and password when clicking on the invite link.
const INVITE_REQUIRED_FIELDS = new Set([EMAIL, SURNAME, FIRST_NAME])

// In edit mode, the username field is disabled, because this is create-only.
// The password fields are also optional, we just keep the current password
// if no new values are provided. Only firstname and surname are required,
// to prevent these fields from being cleared.
const EDIT_REQUIRED_FIELDS = new Set([SURNAME, FIRST_NAME])

export default function collectValidators(
    props,
    name,
    isRequiredField,
    isAttributeField,
    fieldValidators
) {
    const validatorsToApply = []
    const isEditingUser = Boolean(props.user.id)
    const isRequiredAttributeField = isAttributeField && isRequiredField
    const fieldSpecificValidator = validatorLookup[name]
    const isRequiredStaticField =
        !isAttributeField && isEditingUser
            ? EDIT_REQUIRED_FIELDS.has(name)
            : props.inviteUser
            ? INVITE_REQUIRED_FIELDS.has(name)
            : CREATE_REQUIRED_FIELDS.has(name)

    if (fieldSpecificValidator) {
        validatorsToApply.push(fieldSpecificValidator)
    }

    if (isRequiredAttributeField || isRequiredStaticField) {
        validatorsToApply.push(validators.required)
    }

    if (isAttributeField && fieldValidators) {
        validatorsToApply.push(...fieldValidators)
    }

    return validatorsToApply
}
