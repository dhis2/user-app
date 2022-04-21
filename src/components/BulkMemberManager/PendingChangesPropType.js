import PropTypes from 'prop-types'

const pendingChangePropType = PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
}).isRequired

export default PropTypes.shape({
    additions: PropTypes.arrayOf(pendingChangePropType).isRequired,
    removals: PropTypes.arrayOf(pendingChangePropType).isRequired,
})
