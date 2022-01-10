import i18n from '@dhis2/d2-i18n'

function hasValue(value) {
    return typeof value !== 'undefined' && value !== null && value !== ''
}

export function code(value) {
    if (hasValue(value) && value.length > 50) {
        return i18n.t('Exceeds maximum character limit of 50')
    }
}

export function required(value) {
    return !hasValue(value) ? i18n.t('This field is required') : undefined
}
