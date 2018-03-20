import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getItem, initNewItem } from '../../actions';

class RoleForm extends Component {
    static propTypes = {
        getItem: PropTypes.func.isRequired,
        initNewItem: PropTypes.func.isRequired,
    };

    render() {
        console.log(this.props);
        return <div>Ik ben het user role form</div>;
    }
}

const mapStateToProps = state => ({
    role: state.currentItem,
});

export default connect(mapStateToProps, {
    getItem,
    initNewItem,
})(RoleForm);
