import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import { hideSnackbar } from '../actions'

/**
 * A small wrapper around the  MUI Snackbar so it can easily be controlled by state
 * @class
 */
const SnackbarContainer = ({ open, snackbarProps, hideSnackbar }) => {
    const defaults = {
        autoHideDuration: 6000,
        onRequestClose: hideSnackbar,
        style: { whiteSpace: 'nowrap' }, // Forces text to stay on one line
        bodyStyle: { maxWidth: '100%' }, // Overrides the default max-width of 587px
        contentStyle: { display: 'flex' }, // Forces the confirm button to be on the same line as the text
    }
    const finalProps = { ...defaults, ...snackbarProps }
    return <Snackbar open={open} {...finalProps} />
}

SnackbarContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    snackbarProps: PropTypes.object.isRequired,
    hideSnackbar: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    open: state.popups.snackbar.show,
    snackbarProps: state.popups.snackbar.props,
})

export default connect(
    mapStateToProps,
    {
        hideSnackbar,
    }
)(SnackbarContainer)
