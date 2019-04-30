import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../api';
import { hideSharingDialog } from '../actions';

/**
 * A small wrapper around the d2-ui SharingDialog so it can easily be controlled by state
 * @class
 */
const SharingDialogContainer = ({ open, id, type, hideSharingDialog }) => {
    return (
        <SharingDialog
            open={open}
            id={id}
            type={type}
            onRequestClose={hideSharingDialog}
            d2={api.getD2()}
        />
    );
};

SharingDialogContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    hideSharingDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    open: state.popups.sharing.show,
    id: state.popups.sharing.id,
    type: state.popups.sharing.type,
});

export default connect(mapStateToProps, {
    hideSharingDialog,
})(SharingDialogContainer);
