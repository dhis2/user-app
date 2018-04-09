import i18n from 'd2-i18n';
import { NAME, USERS } from './config';

export default function validate(values, props) {
    let errors = {};
    const requiredMsg = i18n.t('This field is required');

    if (!values[NAME]) {
        errors[NAME] = requiredMsg;
    }

    if (values[USERS].length === 0) {
        errors[USERS] = requiredMsg;
    }

    return errors;
}
