import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { hideSharingDialog } from '../actions'
import api from '../api'

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
    )
}

SharingDialogContainer.propTypes = {
    hideSharingDialog: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
}

const mapStateToProps = state => ({
    open: state.popups.sharing.show,
    id: state.popups.sharing.id,
    type: state.popups.sharing.type,
})

export default connect(mapStateToProps, {
    hideSharingDialog,
})(SharingDialogContainer)
