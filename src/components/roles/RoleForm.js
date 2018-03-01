import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class RoleForm extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const { match: { params: { id } } } = this.props;
        return (
            <main>
                <h1>I am the edit user role section!</h1>
                <h2>Displaying info for user role with id: {id}</h2>
                <Link to="/user-roles">Back to user roles</Link>
            </main>
        );
    }
}

export default RoleForm;
