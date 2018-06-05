import i18n from '@dhis2/d2-i18n';
import api from '../api';
import _ from '../constants/lodash';
import createHumanErrorMessage from '../utils/createHumanErrorMessage';

/**
 * Calls the genericFind method of the Api instance to find out whether a userRole/userGroup model instance with the same property value exists
 * @param {Object} values - redux form values object
 * @param {Object} _dispatch - store.dispatch method - ignored
 * @param {Object} props - Component properties, containing either a userRole or userGroup model
 * @param {Object} fieldName - The property name to check on uniqueness
 * @returns {Object} errors - Will be empty of the entry was unique. Otherwise will contain error message  for duplicate property values.
 * @memberof module:utils
 * @function
 */

const asyncValidateUniqueness = async (values, _dispatch, props, fieldName) => {
    let errors = {};
    let validationPromises = [];
    const { validExceptSubmit, asyncBlurFields, group, role } = props;
    const model = role || group;

    // BEWARE!!!! Under certain conditions reduxForm.asyncValidate can be called
    // with param fieldName === undefined. If this happens you can assume everything
    // needs to be validated, so just loop through all fields
    if (validExceptSubmit && !fieldName && asyncBlurFields && asyncBlurFields.length) {
        asyncBlurFields.forEach(blurField => {
            validationPromises.push(asyncValidateField(blurField, values, errors, model));
        });
    } else {
        validationPromises.push(asyncValidateField(fieldName, values, errors, model));
    }

    await Promise.all(validationPromises);
    return errors;
};

const asyncValidateField = async (fieldName, values, errors, model) => {
    const entityName = model.modelDefinition.name;
    const fieldValue = values[fieldName];
    const fieldDisplayName = _.capitalize(fieldName);

    if (!fieldValue) {
        return Promise.resolve(errors);
    }

    try {
        const modelCollection = await api.genericFind(entityName, fieldName, fieldValue);
        if (modelCollection.size > 0) {
            const foundId = modelCollection.values().next().value.id;
            if (foundId !== model.id) {
                errors[fieldName] = i18n.t('{{fieldDisplayName}} is already taken', {
                    fieldDisplayName,
                });
            }
        }
        return errors;
    } catch (error) {
        const fallBackMsg = i18n.t(
            'Could not verify if this {{fieldDisplayName}} is unique',
            {
                fieldDisplayName,
            }
        );

        errors[fieldName] = createHumanErrorMessage(error, fallBackMsg);
        throw errors;
    }
};

export default asyncValidateUniqueness;
