import i18n from '@dhis2/d2-i18n';
import api from '../api';
import _ from '../constants/lodash';

/**
 * Calls the genericFind method of the Api instance to find out whether a userRole/userGroup model instance with the same property value exists
 * @param {Object} values - REDUX form values object
 * @param {Object} _dispatch - store.dispatch method - ignored
 * @param {Object} props - Component properties, containing either a userRole or userGroup model
 * @param {Object} fieldName - The property name to check on uniqueness
 * @returns {Object} errors - Will be empty of the entry was unique. Otherwise will contain error message  for duplicate property values.
 * @memberof module:utils
 * @function
 */

const asyncValidateUniqueness = async (values, _dispatch, props, fieldName) => {
    const formNameValue = values[fieldName];

    if (!formNameValue) {
        return Promise.resolve({});
    }

    let errors = {};
    const model = props.role || props.group;
    const entityName = model.modelDefinition.name;
    const fieldDisplayName = _.capitalize(fieldName);

    try {
        const modelCollection = await api.genericFind(
            entityName,
            fieldName,
            formNameValue
        );
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
        errors[fieldName] = i18n.t(
            'Could not verify if this {{fieldDisplayName}} is unique',
            {
                fieldDisplayName,
            }
        );
        throw errors;
    }
};

export default asyncValidateUniqueness;
