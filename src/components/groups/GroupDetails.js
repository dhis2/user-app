import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER_GROUP, DETAILS } from '../../constants/entityTypes';
import DetailSummary from '../DetailSummary';
import { connect } from 'react-redux';
import { USER_GROUP_DETAILS } from '../../constants/detailFieldConfigs';
import { getItem } from '../../actions';

class GroupDetails extends Component {
    componentWillMount() {
        const { getItem, match: { params: { id } } } = this.props;
        getItem(USER_GROUP, DETAILS, id);
    }

    render() {
        const { group } = this.props;

        return (
            <DetailSummary
                summaryObject={group}
                config={USER_GROUP_DETAILS}
                baseName={USER_GROUP}
            />
        );
    }
}

GroupDetails.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    group: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    getItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    group: state.currentItem,
});

export default connect(mapStateToProps, {
    getItem,
})(GroupDetails);
