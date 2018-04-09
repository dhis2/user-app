import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER_ROLE, DETAILS } from '../constants/entityTypes';
import DetailSummary from '../components/DetailSummary';
import { connect } from 'react-redux';
import { USER_ROLE_DETAILS } from '../constants/detailFieldConfigs';
import { getItem } from '../actions';

class RoleDetails extends Component {
    componentWillMount() {
        const { getItem, match: { params: { id } } } = this.props;
        getItem(USER_ROLE, DETAILS, id);
    }

    render() {
        const { role } = this.props;

        return (
            <DetailSummary
                summaryObject={role}
                config={USER_ROLE_DETAILS}
                baseName={USER_ROLE}
            />
        );
    }
}

RoleDetails.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    role: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    getItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    role: state.currentItem,
});

export default connect(mapStateToProps, {
    getItem,
})(RoleDetails);
