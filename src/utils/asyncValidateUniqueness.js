import i18n from 'd2-i18n';
import api from '../api';
import _ from '../constants/lodash';

const asyncValidateUniqueness = (values, _dispatch, props, fieldName) => {
    const formNameValue = values[fieldName];

    if (!formNameValue) {
        return Promise.resolve({});
    }

    let errors = {};
    const model = props.role || props.group;
    const entityName = model.modelDefinition.name;
    const fieldDisplayName = _.capitalize(fieldName);

    return api
        .genericFind(entityName, fieldName, formNameValue)
        .then(modelCollection => {
            if (modelCollection.size > 0) {
                const foundId = modelCollection.values().next().value.id;
                if (foundId !== model.id) {
                    errors[fieldName] = i18n.t(
                        '{{fieldDisplayName}} is already taken',
                        { fieldDisplayName }
                    );
                }
            }
            return errors;
        })
        .catch(error => {
            errors[fieldName] = i18n.t(
                'Could not verify if this {{fieldDisplayName}} is unique',
                { fieldDisplayName }
            );
            throw errors;
        });
};

export default asyncValidateUniqueness;
