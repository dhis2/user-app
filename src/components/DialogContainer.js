import Dialog from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

/**
 * A thin wrapper around the MUI Dialog component so it can easily be controlled by redux state
 * @class
 */
const DialogContainer = ({ open, dialogProps, content }) => (
    <Dialog key="dialog" open={open} {...dialogProps}>
        {content}
    </Dialog>
)

DialogContainer.propTypes = {
    dialogProps: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    content: PropTypes.object,
}

const mapStateToProps = state => ({
    open: state.popups.dialog.show,
    dialogProps: state.popups.dialog.props,
    content: state.popups.dialog.content,
})

export default connect(mapStateToProps)(DialogContainer)
