import { USERNAME } from './config';
import i18n from 'd2-i18n';
import api from '../../api';

export default function asyncValidateUsername(values, _, props) {
    const newUserName = values[USERNAME];
    const editingExistingUser = props.user && props.user.id;

    if (!newUserName || editingExistingUser) {
        return Promise.resolve();
    }

    let errors = {};
    return api
        .getUserByUsername(newUserName)
        .then(modelCollection => {
            if (modelCollection.size > 0) {
                errors[USERNAME] = i18n.t('Username already taken');
                return errors;
            }
        })
        .catch(error => {
            errors[USERNAME] = i18n.t(
                'There was a problem whilst checking the availability of this username'
            );
            throw errors;
        });
}
