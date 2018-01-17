import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VIEW_STYLE } from '../constants/sharedStyles';

class UserGrid extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };
    render() {
        return <div style={VIEW_STYLE}>Delete current user</div>;
    }
}
export default UserGrid;
