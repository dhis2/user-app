import { hasValue, composeValidators } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { TextField, HiddenField } from './Form'

const getFieldName = attribute => `attributeValues.${attribute.id}`

const AttributePropType = PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    mandatory: PropTypes.bool.isRequired,
    unique: PropTypes.bool.isRequired,
    optionSet: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        }).isRequired
    ),
    valueType: PropTypes.string,
})

const validatorsMap = {
    hasValue,
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
 *     [ ] EMAIL
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
const Attribute = ({ attribute, value }) => {
    const required = attribute.mandatory
    const name = getFieldName(attribute)
    const label = attribute.displayName

    switch (attribute.valueType) {
        case 'TEXT':
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
        default:
            return <HiddenField name={name} />
    }
}

Attribute.propTypes = {
    attribute: AttributePropType.isRequired,
    value: PropTypes.any,
}

// TODO: mandatory validators (required + `hasValue` or other appropriate validator)
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
