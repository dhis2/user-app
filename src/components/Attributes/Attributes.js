import PropTypes from 'prop-types'
import React from 'react'
import Attribute from './Attribute.js'
import AttributePropType from './attributePropType.js'

const Attributes = React.memo(
    ({ attributes, attributeValues, entity, entityType }) => {
        const values = attributeValues?.reduce((values, attributeValue) => {
            values.set(attributeValue.attribute.id, attributeValue.value)
            return values
        }, new Map())

        return attributes.map((attribute) => (
            <Attribute
                key={attribute.id}
                attribute={attribute}
                value={values?.get(attribute.id)}
                entity={entity}
                entityType={entityType}
            />
        ))
    }
)

Attributes.propTypes = {
    attributes: PropTypes.arrayOf(AttributePropType.isRequired).isRequired,
    entityType: PropTypes.string.isRequired,
    attributeValues: PropTypes.arrayOf(
        PropTypes.shape({
            attribute: PropTypes.shape({
                id: PropTypes.string.isRequired,
            }).isRequired,
            value: PropTypes.any.isRequired,
        }).isRequired
    ),
    entity: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
}

export default Attributes
