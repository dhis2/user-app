import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    TextField,
    TextAreaField,
    SingleSelectField,
    EmailField,
    DateField,
    CheckboxField,
} from '../Form.js'
import AttributePropType from './attributePropType.js'
import {
    validators,
    useDebouncedUniqueAttributeValidator,
} from './validators.js'

const getFieldName = (attribute) => `attributeValues.${attribute.id}`

/**************************************************************************
 * Attributes can be either based on an optionSet, or based on a valueType.
 * Attributes based on optionSets are supported.
 * Attributes based on valueTypes are partially supported, see below:
 *     [X] TEXT
 *     [X] LONG_TEXT
 *     [ ] LETTER
 *     [ ] PHONE_NUMBER
 *     [X] EMAIL
 *     [X] BOOLEAN
 *     [X] TRUE_ONLY
 *     [X] DATE
 *     [ ] DATETIME
 *     [ ] TIME
 *     [X] NUMBER
 *     [ ] UNIT_INTERVAL
 *     [ ] PERCENTAGE
 *     [X] INTEGER
 *     [X] INTEGER_POSITIVE
 *     [X] INTEGER_NEGATIVE
 *     [ ] INTEGER_ZERO_OR_POSITIVE
 *     [ ] TRACKER_ASSOCIATE
 *     [ ] USERNAME
 *     [ ] COORDINATE
 *     [ ] ORGANISATION_UNIT
 *     [ ] AGE
 *     [ ] URL
 *     [ ] FILE_RESOURCE
 *     [ ] IMAGE
 ****************************************************************************/
const Attribute = ({ attribute, value, entity, entityType }) => {
    const uniqueValidator = useDebouncedUniqueAttributeValidator({
        attribute,
        currentValue: value,
        entity,
        entityType,
    })

    const required = attribute.mandatory
    const name = getFieldName(attribute)
    const label = attribute.displayName
    const unique = attribute.unique

    if (attribute.optionSet) {
        const options = attribute.optionSet.options.map(
            ({ id, displayName }) => ({
                label: displayName,
                value: id,
            })
        )
        // SingleSelectField throws an error if its value does not correspond to an option
        const initialValue = options.find((option) => option.value === value)
            ? value
            : undefined

        return (
            <SingleSelectField
                required={required}
                clearable={!required}
                name={name}
                label={label}
                options={options}
                initialValue={initialValue}
                validate={validators(
                    {
                        hasValue: required,
                        unique,
                    },
                    uniqueValidator
                )}
            />
        )
    }

    switch (attribute.valueType) {
        case 'LONG_TEXT':
            return (
                <TextAreaField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'EMAIL':
            return (
                <EmailField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            email: true,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'NUMBER':
            // React final form is not rendering validation errors for
            // <input type="number" /> for some reason, so use standard
            // text field
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            number: true,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'INTEGER':
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            integer: true,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'INTEGER_POSITIVE':
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            positiveInteger: true,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'INTEGER_NEGATIVE':
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            negativeInteger: true,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'DATE':
            return (
                <DateField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
        case 'BOOLEAN': {
            // SingleSelectField throws an error if its value does not correspond to an option
            const initialValue = ['true', 'false'].includes(value)
                ? value
                : undefined
            return (
                <SingleSelectField
                    required={required}
                    clearable={!required}
                    name={name}
                    label={label}
                    options={[
                        { label: i18n.t('Yes'), value: 'true' },
                        { label: i18n.t('No'), value: 'false' },
                    ]}
                    initialValue={initialValue}
                    validate={validators({
                        hasValue: required,
                    })}
                />
            )
        }
        case 'TRUE_ONLY':
            return (
                <CheckboxField name={name} label={label} initialValue={value} />
            )
        // Use TEXT as fallback field type. This way all attributes will always
        // be editable, albeit not necessarily enforcing the correct formatting
        case 'TEXT':
        default:
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators(
                        {
                            hasValue: required,
                            unique,
                        },
                        uniqueValidator
                    )}
                />
            )
    }
}

Attribute.propTypes = {
    attribute: AttributePropType.isRequired,
    entityType: PropTypes.string.isRequired,
    entity: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    value: PropTypes.any,
}

export default Attribute
