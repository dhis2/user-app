import { USERNAME } from './config';
import i18n from '@dhis2/d2-i18n';
import api from '../../api';

export function asyncValidatorSwitch(values, _, props, blurredField) {
    if (blurredField === USERNAME) {
        console.log('asyncValidateUsername', values, blurredField);
        return asyncValidateUsername(values, _, props);
    }

    return validateAttribute(values, _, props, blurredField);
}

async function validateAttribute(values, _, props, blurredField) {
    const errors = {
        [blurredField]: 'HOI',
    };
    return Promise.resolve(errors);
}

export async function asyncValidateUsername(values, _, props) {
    const newUserName = values[USERNAME];
    const editingExistingUser = props.user && props.user.id;

    if (!newUserName || editingExistingUser) {
        return Promise.resolve();
    }

    let errors = {};

    try {
        const modelCollection = await api.genericFind(
            'users',
            'userCredentials.username',
            newUserName
        );
        if (modelCollection.size > 0) {
            errors[USERNAME] = i18n.t('Username already taken');
        }
        return errors;
    } catch (error) {
        errors[USERNAME] = i18n.t(
            'There was a problem whilst checking the availability of this username'
        );
        throw errors;
    }
}
