import i18n from '@dhis2/d2-i18n';
import { NAME, USERS } from './config';

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

    return errors;
}
