import { USERNAME } from './config';
import { USER_ATTRIBUTE_FIELD_PREFIX } from '../../utils/dynamicAttributeFieldGenerator';
import i18n from '@dhis2/d2-i18n';
import api from '../../api';

export function asyncValidatorSwitch(values, _, props, blurredField) {
    // Skip aSync validation when submitting the form because all fields have been
    // validated on blur anyway, and the server will reject them
    if (!blurredField) {
        return Promise.resolve({});
    }

    if (blurredField === USERNAME) {
        return asyncValidateUsername(values, _, props);
    }

    return isAttributeUnique(values, props, blurredField);
}

async function isAttributeUnique(values, props, blurredField) {
    const errors = {};
    const userId = props.user.id || '_';
    const attributeId = blurredField.replace(USER_ATTRIBUTE_FIELD_PREFIX, '');
    const value = values[blurredField];

    try {
        const isUnique = await api.isUserAttributeUnique(userId, attributeId, value);
        if (!isUnique) {
            errors[blurredField] = i18n.t(
                'Attribute value needs to be unique, value already taken.'
            );
        }
        return errors;
    } catch (error) {
        errors[blurredField] = i18n.t(
            'There was a problem checking if this attribute value is unique'
        );
        throw errors;
    }
}

export async function asyncValidateUsername(values, _, props) {
    const newUserName = values[USERNAME];
    const editingExistingUser = props.user && props.user.id;

    if (!newUserName || editingExistingUser) {
        return Promise.resolve();
    }

    const errors = {};

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
