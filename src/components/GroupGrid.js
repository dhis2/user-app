import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DeleteCurrentUserView extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };
    render() {
        return <div>Group grid</div>;
    }
}
export default DeleteCurrentUserView;
