import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { hideSnackbar } from '../actions';

const SnackbarContainer = ({ open, snackbarProps, hideSnackbar }) => {
    const defaults = {
        autoHideDuration: 3000,
        onRequestClose: hideSnackbar,
    };
    const finalProps = { ...defaults, ...snackbarProps };
    return <Snackbar open={open} {...finalProps} />;
};

SnackbarContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    snackbarProps: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    open: state.notifications.snackbar.show,
    snackbarProps: state.notifications.snackbar.props,
});

export default connect(mapStateToProps, {
    hideSnackbar,
})(SnackbarContainer);
