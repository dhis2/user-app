import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class UserEdit extends Component {
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

export default UserEdit;
