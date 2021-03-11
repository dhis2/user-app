import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import theme from '../theme'

/**
 * Component that adds d2 to the context and applies the dhis2 theme
 * @param {Object} props
 * @param {Object} props.d2 - The d2 instance to add to the context of children
 * @class
 */
class AppWithD2ContextAndTheme extends Component {
    getChildContext = () => ({
        d2: this.props.d2,
    })

    render = () => (
        <MuiThemeProvider muiTheme={theme}>
            {this.props.children}
        </MuiThemeProvider>
    )
}

AppWithD2ContextAndTheme.childContextTypes = {
    d2: PropTypes.object,
}

AppWithD2ContextAndTheme.propTypes = {
    children: PropTypes.object.isRequired,
    d2: PropTypes.object,
}

export default AppWithD2ContextAndTheme
