import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserGrid extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };
    render() {
        return <div>Delete current user</div>;
    }
}
export default UserGrid;
