import { USERNAME } from './config';
import i18next from 'i18next';
import api from '../../../api';

export default function asyncValidateUsername (values) {
    const newUserName = values[USERNAME];
    if (!newUserName) {
        return Promise.resolve();
    }
    let errors = {};
    return api
        .getUserByUsername(newUserName)
        .then(modelCollection => {
            if (modelCollection.size > 0) {
                errors[USERNAME] = i18next.t('Username already taken');
                return errors;
            }
        })
        .catch(error => {
            errors[USERNAME] = i18next.t(
                'There was a problem whilst checking the availability of this username'
            );
            throw errors;
        });
}
