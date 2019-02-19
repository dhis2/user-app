import i18n from '@dhis2/d2-i18n';
import _ from '../constants/lodash';
import api from '../api';
import { USER, USER_GROUP } from '../constants/entityTypes';
import { USER_ATTRIBUTE_FIELD_PREFIX } from './attributeFieldHelpers';
import { USERNAME, FORM_NAME as USER_FORM } from '../containers/UserForm/config';
import { CODE, NAME, FORM_NAME as GROUP_FORM } from '../containers/GroupForm/config';
import { FORM_NAME as REPLICATE_USER_FORM } from '../components/ReplicateUserForm';
import createHumanErrorMessage from './createHumanErrorMessage';

export async function asyncValidatorSwitch(values, _, props, blurredField) {
    const priorErrors = props.asyncErrors;
    // Skip aSync validation when submitting the form because all fields have been
    // validated on blur anyway, and the server will reject them
    if (!blurredField && !priorErrors) {
        return Promise.resolve();
    }

    let newError;
    if (props.form === USER_FORM && blurredField === USERNAME) {
        newError = await getUserNameError(values, props);
    } else if (
        props.form === GROUP_FORM &&
        (blurredField === CODE || blurredField === NAME)
    ) {
        newError = await getGenericUniquenessError(values, props, blurredField);
    } else {
        newError = await getAttributeUniquenessError(values, props, blurredField);
    }

    const errors = priorErrors || newError ? { ...priorErrors, ...newError } : undefined;

    if (errors) {
        throw errors;
    } else {
        return Promise.resolve();
    }
}

export async function asyncValidateUsername(values, _, props, blurredField) {
    return asyncSingleFieldValidator(values, props, blurredField, getUserNameError);
}

export async function asyncValidateUniqueness(values, _, props, blurredField) {
    return asyncSingleFieldValidator(
        values,
        props,
        blurredField,
        getGenericUniquenessError
    );
}

async function asyncSingleFieldValidator(values, props, blurredField, apiMethod) {
    if (!blurredField) {
        return Promise.resolve();
    }
    const error = await apiMethod(values, props, blurredField);
    if (error) {
        throw error;
    } else {
        return Promise.resolve();
    }
}

async function getUserNameError(values, props) {
    const newUserName = values[USERNAME];
    const editingExistingUser =
        props.form !== REPLICATE_USER_FORM && props.user && props.user.id;

    if (!newUserName || editingExistingUser) {
        return Promise.resolve();
    }

    try {
        const modelCollection = await api.genericFind(
            'users',
            'userCredentials.username',
            newUserName
        );
        if (modelCollection.size > 0) {
            return {
                [USERNAME]: i18n.t('Username already taken'),
            };
        }
    } catch (error) {
        return {
            [USERNAME]: i18n.t(
                'There was a problem whilst checking the availability of this username'
            ),
        };
    }
}

/**
 * Calls the genericFind method of the Api instance to find out whether a userRole/userGroup model instance with the same property value exists
 * @param {Object} values - redux form values object
 * @param {Object} props - Component properties, containing either a userRole or userGroup model
 * @param {Object} fieldName - The property name to check on uniqueness
 * @returns {Object} errors - Will be empty of the entry was unique. Otherwise will contain error message  for duplicate property values.
 * @memberof module:utils
 * @function
 */

async function getGenericUniquenessError(values, props, fieldName) {
    const { group, role } = props;
    const model = role || group;
    const entityName = model.modelDefinition.name;
    const fieldValue = values[fieldName];
    const fieldDisplayName = _.capitalize(fieldName);

    if (!fieldValue) {
        return Promise.resolve();
    }

    try {
        const modelCollection = await api.genericFind(entityName, fieldName, fieldValue);
        if (modelCollection.size > 0) {
            const foundId = modelCollection.values().next().value.id;
            if (foundId !== model.id) {
                return {
                    [fieldName]: i18n.t('{{fieldDisplayName}} is already taken', {
                        fieldDisplayName,
                    }),
                };
            }
        }
    } catch (error) {
        const fallBackMsg = i18n.t(
            'Could not verify if this {{fieldDisplayName}} is unique',
            {
                fieldDisplayName,
            }
        );

        return {
            [fieldName]: createHumanErrorMessage(error, fallBackMsg),
        };
    }
}

async function getAttributeUniquenessError(values, props, blurredField) {
    const value = values[blurredField];

    if (!value) {
        return Promise.resolve();
    }

    const entityType = props.form === USER_FORM ? USER : USER_GROUP;
    const id = entityType === USER ? props.user.id || '_' : props.group.id || '_';
    const attributeId = blurredField.replace(USER_ATTRIBUTE_FIELD_PREFIX, '');

    try {
        const isUnique = await api.isAttributeUnique(entityType, id, attributeId, value);
        if (!isUnique) {
            return {
                [blurredField]: i18n.t(
                    'Attribute value needs to be unique, value already taken.'
                ),
            };
        }
    } catch (error) {
        return {
            [blurredField]: i18n.t(
                'There was a problem checking if this attribute value is unique'
            ),
        };
    }
}
