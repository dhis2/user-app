import PropTypes from 'prop-types'

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

export default AttributePropType
