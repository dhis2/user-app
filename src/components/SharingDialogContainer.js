import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { connect } from 'react-redux';
import SharingDialog from 'd2-ui-sharing';
import api from '../api';
import { hideSharingDialog, showSnackbar } from '../actions';

class SharingDialogContainer extends Component {
    closeAndConfirm = () => {
        const { hideSharingDialog, showSnackbar } = this.props;
        const message = i18next.t('Sharing settings have been updated');
        hideSharingDialog();
        showSnackbar({ message });
    };

    render() {
        const { open, id, type } = this.props;
        return (
            <SharingDialog
                open={open}
                id={id}
                type={type}
                onRequestClose={this.closeAndConfirm}
                d2={api.getD2()}
            />
        );
    }
}

SharingDialogContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    hideSharingDialog: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    open: state.popups.sharing.show,
    id: state.popups.sharing.id,
    type: state.popups.sharing.type,
});

export default connect(mapStateToProps, {
    hideSharingDialog,
    showSnackbar,
})(SharingDialogContainer);
