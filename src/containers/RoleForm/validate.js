import i18n from '@dhis2/d2-i18n';
import { NAME } from './config';

export default function validate(values, { pristine }) {
    let errors = {};

    if (pristine) {
        return errors;
    }

    if (!values[NAME]) {
        errors[NAME] = i18n.t('This field is required');
    }
    return errors;
}
