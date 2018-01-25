import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RoleGrid extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };
    render() {
        return <div>Role grid</div>;
    }
}
export default RoleGrid;
