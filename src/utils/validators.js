import i18n from '@dhis2/d2-i18n'

function isInteger(value) {
    if (isNaN(value)) {
        return false
    }
    const x = parseFloat(value)
    return (x | 0) === x
}

function hasValue(value) {
    return typeof value !== 'undefined' && value !== null && value !== ''
}

export function code(value) {
    if (hasValue(value) && value.length > 50) {
        return i18n.t('Exceeds maximum character limit of 50')
    }
}

export function date(value) {
    const DATE_PATTERN = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
    if (hasValue(value) && !DATE_PATTERN.test(value)) {
        return i18n.t(
            'Please enter a valid date with the following format yyyy-mm-dd'
        )
    }
}

export function required(value) {
    return !hasValue(value) ? i18n.t('This field is required') : undefined
}

export function integer(value) {
    if (hasValue(value) && !isInteger(value)) {
        return i18n.t('Value should be an integer')
    }
}

export function positiveInteger(value) {
    if (hasValue(value) && (!isInteger(value) || parseInt(value, 10) <= 0)) {
        return i18n.t('Value should be a positive integer')
    }
}

export function negativeInteger(value) {
    if (hasValue(value) && (!isInteger(value) || parseInt(value, 10) >= 0)) {
        return i18n.t('Value should be a nagative integer')
    }
}

export function number(value) {
    if (hasValue(value) && isNaN(value)) {
        return i18n.t('Value should be a number')
    }
}
