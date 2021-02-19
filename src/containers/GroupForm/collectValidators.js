/* eslint-disable max-params */

import { required, code } from '../../utils/validators'
import { NAME, CODE } from './config'

export default function collectValidators(
    props,
    name,
    isRequiredField,
    isAttributeField,
    fieldValidators
) {
    const validatorsToApply = []
    const isRequiredAttributeField = isAttributeField && isRequiredField

    if (name === NAME) {
        validatorsToApply.push(required)
    }

    if (name === CODE) {
        validatorsToApply.push(code)
    }

    if (isRequiredAttributeField) {
        validatorsToApply.push(required)
    }

    if (isAttributeField && fieldValidators) {
        validatorsToApply.push(...fieldValidators)
    }

    return validatorsToApply
}
