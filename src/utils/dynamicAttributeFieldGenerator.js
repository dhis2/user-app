import { renderTextField } from './fieldRenderers';
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

const mapping = {
    TEXT: {
        fieldRenderer: renderTextField,
    },
    LONG_TEXT: {
        fieldRenderer: renderTextField,
        props: {
            multiline: true,
        },
    },
    BOOLEAN: {},
    TRUE_ONLY: {},
    NUMBER: {},
    INTEGER: {},
    INTEGER_POSITIVE: {},
    INTEGER_NEGATIVE: {},
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
    return {
        name: `userAttibute_${attribute.id}`,
        isAttributeField: true,
        label: attribute.displayName,
        isRequiredField: attribute.mandatory,
        shouldBeUnique: attribute.unique,
        attributeId: attribute.id,
        value: (userAttribute && userAttribute.value) || null,
        ...mapping[attribute.valueType],
    };
}
