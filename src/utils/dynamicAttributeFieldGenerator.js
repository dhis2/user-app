import i18n from '@dhis2/d2-i18n';
import { renderTextField, renderCheckbox, renderSelectField } from './fieldRenderers';
import { number, integer, positiveInteger, negativeInteger, date } from './validators';
import browserHasDateInputSupport from './browserHasDateInputSupport';

export const USER_ATTRIBUTE_FIELD_PREFIX = 'userAttibute_';
export const NO_VALUE_OPTION = 'no_value';
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
    OPTION_SET: {
        fieldRenderer: renderSelectField,
    },
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
            options: [
                { id: 'true', label: i18n.t('Yes') },
                { id: 'false', label: i18n.t('No') },
            ],
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

function generateAttributeField(
    { id, valueType, displayName, mandatory, unique, optionSet },
    userAttributeValues
) {
    const userAttribute =
        userAttributeValues &&
        userAttributeValues.find(attributeValue => attributeValue.attribute.id === id);

    const valueTypeProps = getValueTypeProps(valueType, optionSet, mandatory);

    return {
        name: USER_ATTRIBUTE_FIELD_PREFIX + id,
        isAttributeField: true,
        label: displayName,
        isRequiredField: mandatory,
        shouldBeUnique: unique,
        attributeId: id,
        value: (userAttribute && userAttribute.value) || null,
        valueType,
        ...valueTypeProps,
    };
}

function getValueTypeProps(valueType, optionSet, mandatory) {
    // Attributes based on an option-set have TEXT as their value type but need to render a select/dropdown with the options
    const valueTypeProps = optionSet
        ? {
              ...valueTypeMapping.OPTION_SET,
              props: {
                  options: optionSet.options.map(option => ({
                      id: option.id,
                      label: option.displayName,
                  })),
              },
          }
        : // Use valueTypeMapping.TEXT as fallback field renderer.
          // This way all attributes will always be editable, albeit not necesarrily enforcing the correct formatting
          valueTypeMapping[valueType] || valueTypeMapping.TEXT;

    // Optional dropdown fields need a way to be cleared
    if (
        valueTypeProps.fieldRenderer === renderSelectField &&
        !mandatory &&
        valueTypeProps.props.options[0].id !== NO_VALUE_OPTION
    ) {
        valueTypeProps.props.options = [
            {
                id: NO_VALUE_OPTION,
                label: i18n.t('<No value>'),
            },
            ...valueTypeProps.props.options,
        ];
    }

    return valueTypeProps;
}
