import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER, DETAILS } from '../constants/entityTypes';
import DetailSummary from '../components/DetailSummary';
import { connect } from 'react-redux';
import { USER_PROFILE } from '../constants/detailFieldConfigs';
import { getItem } from '../actions';

class UserProfile extends Component {
    componentWillMount() {
        const { getItem, match: { params: { id } } } = this.props;
        getItem(USER, DETAILS, id);
    }

    render() {
        const { user } = this.props;
        return (
            <DetailSummary summaryObject={user} config={USER_PROFILE} baseName={USER} />
        );
    }
}

UserProfile.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    getItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    user: state.currentItem,
});

export default connect(mapStateToProps, {
    getItem,
})(UserProfile);
