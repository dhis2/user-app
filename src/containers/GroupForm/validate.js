import i18n from '@dhis2/d2-i18n';
import { NAME, CODE, USERS } from './config';

export default function validate(values, { pristine }) {
    let errors = {};
    const requiredMsg = i18n.t('This field is required');

    if (pristine) {
        return errors;
    }

    if (!values[NAME]) {
        errors[NAME] = requiredMsg;
    }

    if (values[USERS].length === 0) {
        errors[USERS] = requiredMsg;
    }

    if (values[CODE] && values[CODE].length > 50) {
        errors[CODE] = i18n.t('Exceeds maximum character limit of 50');
    }

    return errors;
}
