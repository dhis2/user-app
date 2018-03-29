import i18next from 'i18next';
import { NAME } from './config';

export default function validate(values, props) {
    let errors = {};
    if (!values[NAME]) {
        errors[NAME] = i18next.t('This field is required');
    }
    return errors;
}
