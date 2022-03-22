import PropTypes from 'prop-types'
import { Component } from 'react'

/**
 * Component that adds d2 to the context and applies the dhis2 theme
 * @param {Object} props
 * @param {Object} props.d2 - The d2 instance to add to the context of children
 * @class
 */
class AppWithD2Context extends Component {
    getChildContext = () => ({
        d2: this.props.d2,
    })

    render = () => this.props.children
}

AppWithD2Context.childContextTypes = {
    d2: PropTypes.object,
}

AppWithD2Context.propTypes = {
    children: PropTypes.object.isRequired,
    d2: PropTypes.object,
}

export default AppWithD2Context
