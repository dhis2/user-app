import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { hideSnackbar } from '../actions';

/**
 * A small wrapper around the  MUI Snackbar so it can easily be controlled by state
 * @class
 */
const SnackbarContainer = ({ open, snackbarProps, hideSnackbar }) => {
    const defaults = {
        autoHideDuration: 6000,
        onRequestClose: hideSnackbar,
    };
    const finalProps = { ...defaults, ...snackbarProps };
    return <Snackbar open={open} {...finalProps} />;
};

SnackbarContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    snackbarProps: PropTypes.object.isRequired,
    hideSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    open: state.popups.snackbar.show,
    snackbarProps: state.popups.snackbar.props,
});

export default connect(mapStateToProps, {
    hideSnackbar,
})(SnackbarContainer);
