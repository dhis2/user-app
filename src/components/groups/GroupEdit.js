import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class GroupEdit extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const { match: { params: { id } } } = this.props;
        return (
            <main>
                <h1>I am the edit user group section!</h1>
                <h2>Displaying info for user group with id: {id}</h2>
                <Link to="/user-groups">Back to user groups</Link>
            </main>
        );
    }
}

export default GroupEdit;
