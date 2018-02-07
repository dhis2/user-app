import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';

const DialogContainer = ({ open, dialogProps, content }) => (
    <Dialog key="dialog" open={open} {...dialogProps}>
        {content}
    </Dialog>
);

DialogContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    dialogProps: PropTypes.object.isRequired,
    content: PropTypes.object,
};

const mapStateToProps = state => ({
    open: state.notifications.dialog.show,
    dialogProps: state.notifications.dialog.props,
    content: state.notifications.dialog.content,
});

export default connect(mapStateToProps)(DialogContainer);
