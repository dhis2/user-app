import PropTypes from 'prop-types'

export const AuthorityPropType = PropTypes.shape({
    empty: PropTypes.bool,
    id: PropTypes.string,
    implicit: PropTypes.bool,
    name: PropTypes.string,
    selected: PropTypes.bool,
})

export const MetadataAuthoritiesPropType = PropTypes.arrayOf(
    PropTypes.shape({
        addUpdatePrivate: AuthorityPropType.isRequired,
        addUpdatePublic: AuthorityPropType.isRequired,
        delete: AuthorityPropType.isRequired,
        name: PropTypes.string.isRequired,
        externalAccess: AuthorityPropType,
    })
)
