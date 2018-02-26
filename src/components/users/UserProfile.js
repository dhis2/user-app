import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER } from '../../constants/entityTypes';
import DetailView from '../DetailView';
import { connect } from 'react-redux';
import { USER_PROFILE_DISPLAY_FIELD_CONFIG } from '../../constants/defaults';
import { getUser } from '../../actions';

class UserProfile extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        getUser: PropTypes.func.isRequired,
    };

    componentWillMount() {
        const { getUser, match: { params: { id } } } = this.props;
        getUser(id);
    }

    render() {
        const { user } = this.props;

        return (
            <DetailView
                summaryObject={user}
                config={USER_PROFILE_DISPLAY_FIELD_CONFIG}
                baseName={USER}
            />
        );
    }
}

const mapStateToProps = state => ({
    user: state.currentItem,
});

export default connect(mapStateToProps, {
    getUser,
})(UserProfile);
