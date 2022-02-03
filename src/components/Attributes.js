import i18n from '@dhis2/d2-i18n'
import {
    hasValue,
    composeValidators,
    email,
    number,
    integer,
    createNumberRange,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    TextField,
    TextAreaField,
    SingleSelectField,
    EmailField,
    DateField,
} from './Form'

const getFieldName = attribute => `attributeValues.${attribute.id}`

const AttributePropType = PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    mandatory: PropTypes.bool.isRequired,
    unique: PropTypes.bool.isRequired,
    optionSet: PropTypes.shape({
        options: PropTypes.arrayOf(
            PropTypes.shape({
                displayName: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
            }).isRequired
        ).isRequired,
    }),
    valueType: PropTypes.string,
})

const validatorsMap = {
    hasValue,
    email,
    number,
    integer,
    positiveInteger: composeValidators(
        integer,
        createNumberRange(
            0,
            Infinity,
            i18n.t('Value should be a positive integer')
        )
    ),
    negativeInteger: composeValidators(
        integer,
        createNumberRange(
            -Infinity,
            0,
            i18n.t('Value should be a nagative integer')
        )
    ),
}
const validators = validatorConditionals => {
    const validators = []
    for (const [validatorKey, condition] of Object.entries(
        validatorConditionals
    )) {
        if (condition) {
            const validator = validatorsMap[validatorKey]
            validators.push(validator)
        }
    }
    return composeValidators(...validators)
}

/**************************************************************************
 * Attributes can be either based on an optionSet, or based on a valueType.
 * Attributes based on optionSets are supported.
 * Attributes based on valueTypes are partially supported, see below:
 *     [X] TEXT
 *     [X] LONG_TEXT
 *     [ ] LETTER
 *     [ ] PHONE_NUMBER
 *     [X] EMAIL
 *     [.X] BOOLEAN
 *     [.X] TRUE_ONLY
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
const Attribute = ({ attribute, value }) => {
    const required = attribute.mandatory
    const name = getFieldName(attribute)
    const label = attribute.displayName

    if (attribute.optionSet) {
        return (
            <SingleSelectField
                required={required}
                clearable={!required}
                name={name}
                label={label}
                options={attribute.optionSet.options.map(
                    ({ id, displayName }) => ({
                        label: displayName,
                        value: id,
                    })
                )}
                initialValue={value}
                validate={validators({
                    hasValue: required,
                    number: true,
                })}
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
                    validate={validators({
                        hasValue: required,
                    })}
                />
            )
        case 'EMAIL':
            return (
                <EmailField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators({
                        hasValue: required,
                        email: true,
                    })}
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
                    validate={validators({
                        hasValue: required,
                        number: true,
                    })}
                />
            )
        case 'INTEGER':
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators({
                        hasValue: required,
                        integer: true,
                    })}
                />
            )
        case 'INTEGER_POSITIVE':
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators({
                        hasValue: required,
                        positiveInteger: true,
                    })}
                />
            )
        case 'INTEGER_NEGATIVE':
            return (
                <TextField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators({
                        hasValue: required,
                        negativeInteger: true,
                    })}
                />
            )
        case 'DATE':
            return (
                <DateField
                    required={required}
                    name={name}
                    label={label}
                    initialValue={value}
                    validate={validators({
                        hasValue: required,
                    })}
                />
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
                    validate={validators({
                        hasValue: required,
                    })}
                />
            )
    }
}

Attribute.propTypes = {
    attribute: AttributePropType.isRequired,
    value: PropTypes.any,
}

// TODO: unique validators (see `getGenericUniquenessError`)
const Attributes = ({ attributes, attributeValues }) => {
    const values = attributeValues?.reduce((values, attributeValue) => {
        values.set(attributeValue.attribute.id, attributeValue.value)
        return values
    }, new Map())

    return attributes.map(attribute => (
        <Attribute
            key={attribute.id}
            attribute={attribute}
            value={values?.get(attribute.id)}
        />
    ))
}

Attributes.propTypes = {
    attributes: PropTypes.arrayOf(AttributePropType.isRequired).isRequired,
    attributeValues: PropTypes.arrayOf(
        PropTypes.shape({
            attribute: PropTypes.shape({
                id: PropTypes.string.isRequired,
            }).isRequired,
            value: PropTypes.any.isRequired,
        }).isRequired
    ),
}

export default Attributes
