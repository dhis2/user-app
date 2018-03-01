import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class UserForm extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const { match: { params: { id } } } = this.props;
        return (
            <main>
                <h1>I am the edit user section!</h1>
                <h2>Displaying info for user with id: {id}</h2>
                <Link to="/users">Back to users</Link>
            </main>
        );
    }
}

export default UserForm;
