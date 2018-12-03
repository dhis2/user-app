import { renderTextField, renderCheckbox, renderSelectField } from './fieldRenderers';
import { number, integer, positiveInteger, negativeInteger, date } from './validators';
import browserHasDateInputSupport from './browserHasDateInputSupport';

export const USER_ATTRIBUTE_FIELD_PREFIX = 'userAttibute_';
/*
Below is a list of all possible attribute valueTypes. 
Only the checked ones are implemented
    [X] TEXT
    [X] LONG_TEXT
    [ ] LETTER
    [ ] PHONE_NUMBER
    [ ] EMAIL
    [X] BOOLEAN
    [X] TRUE_ONLY
    [ ] DATE
    [ ] DATETIME
    [ ] TIME
    [X] NUMBER
    [ ] UNIT_INTERVAL
    [ ] PERCENTAGE
    [X] INTEGER
    [X] INTEGER_POSITIVE
    [X] INTEGER_NEGATIVE
    [ ] INTEGER_ZERO_OR_POSITIVE
    [ ] TRACKER_ASSOCIATE
    [ ] USERNAME
    [ ] COORDINATE
    [ ] ORGANISATION_UNIT
    [ ] AGE
    [ ] URL
    [ ] FILE_RESOURCE
    [ ] IMAGE
*/

const valueTypeMapping = {
    TEXT: {
        fieldRenderer: renderTextField,
    },
    LONG_TEXT: {
        fieldRenderer: renderTextField,
        props: {
            multiLine: true,
            rows: 3,
            rowsMax: 6,
        },
    },
    DATE: {
        fieldRenderer: renderTextField,
        props: {
            type: 'date',
            // If browser supports <input type="date"/>, the label should always float above the input
            // because the date input has some text that overlaps with the hintText
            floatingLabelFixed: browserHasDateInputSupport(),
            hintText: null,
        },
        fieldValidators: [date],
    },
    BOOLEAN: {
        fieldRenderer: renderSelectField,
        props: {
            options: [{ id: 'true', label: 'Yes' }, { id: 'false', label: 'No' }],
        },
    },
    TRUE_ONLY: {
        fieldRenderer: renderCheckbox,
    },
    NUMBER: {
        fieldRenderer: renderTextField,
        fieldValidators: [number],
    },
    INTEGER: {
        fieldRenderer: renderTextField,
        fieldValidators: [integer],
    },
    INTEGER_POSITIVE: {
        fieldRenderer: renderTextField,
        fieldValidators: [positiveInteger],
    },
    INTEGER_NEGATIVE: {
        fieldRenderer: renderTextField,
        fieldValidators: [negativeInteger],
    },
};

export default function generateAttributeFields(attributes, userAttributeValues) {
    return attributes.map(attribute =>
        generateAttributeField(attribute, userAttributeValues)
    );
}

function generateAttributeField(attribute, userAttributeValues) {
    const userAttribute =
        userAttributeValues &&
        userAttributeValues.find(
            attributeValue => attributeValue.attribute.id === attribute.id
        );
    // Use valueTypeMapping.TEXT as fallback field renderer.
    // This way all attributes will always be editable, albeit not necesarrily enforcing the correct formatting
    const valueTypeProps = valueTypeMapping[attribute.valueType] || valueTypeMapping.TEXT;
    return {
        name: USER_ATTRIBUTE_FIELD_PREFIX + attribute.id,
        isAttributeField: true,
        label: attribute.displayName,
        isRequiredField: attribute.mandatory,
        shouldBeUnique: attribute.unique,
        attributeId: attribute.id,
        value: (userAttribute && userAttribute.value) || null,
        valueType: attribute.valueType,
        ...valueTypeProps,
    };
}
