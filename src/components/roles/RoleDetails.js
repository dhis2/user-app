import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { USER_ROLE } from '../../constants/entityTypes';
import DetailView from '../DetailView';
import { connect } from 'react-redux';
import { USER_PROFILE_DISPLAY_FIELD_CONFIG } from '../../constants/defaults';
import { getRole } from '../../actions';

class RoleDetails extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        role: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        getRole: PropTypes.func.isRequired,
    };

    componentWillMount() {
        const { getRole, match: { params: { id } } } = this.props;
        getRole(id);
    }

    render() {
        const { role } = this.props;

        return (
            <DetailView
                summaryObject={role}
                config={USER_PROFILE_DISPLAY_FIELD_CONFIG}
                baseName={USER_ROLE}
            />
        );
    }
}

const mapStateToProps = state => ({
    role: state.currentItem,
});

export default connect(mapStateToProps, {
    getRole,
})(RoleDetails);
