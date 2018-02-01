import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { translate } from '../../utils';
import Heading from 'd2-ui/lib/headings/Heading.component';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import IconLink from '../IconLink';
import ErrorMessage from '../ErrorMessage';
import { connect } from 'react-redux';
import { USER_PROFILE_FIELDS_JSON as PROFILE_FIELDS } from '../../constants/defaults';
import { getUser } from '../../actions';

const styles = {
    overflowSecundaryText: {
        overflow: 'auto',
        whiteSpace: 'normal',
        height: 'auto',
    },
};

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

    renderProfileFields(user) {
        return PROFILE_FIELDS.map((field, index) => {
            const label = translate(field);
            const value = user[field] || ' ';
            return (
                <ListItem
                    key={index}
                    primaryText={label}
                    secondaryText={<p style={styles.overflowSecundaryText}>{value}</p>}
                    secondaryTextLines={1}
                />
            );
        });
    }

    render() {
        const { user } = this.props;

        if (user === null) {
            return <LoadingMask />;
        }

        if (typeof user === 'string') {
            const introText = 'There was an error fetching the user:';
            return <ErrorMessage introText={introText} errorMessage={user} />;
        }

        const { id } = user;
        return (
            <main style={{ width: '100%' }}>
                <Heading>
                    <IconLink to="/users" tooltip="Back to users" icon="arrow_back" />
                    {user.displayName}
                    <IconLink to={`/users/edit/${id}`} tooltip="Edit user" icon="edit" />
                </Heading>
                <Paper>
                    <List>{this.renderProfileFields(user)}</List>
                </Paper>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    user: state.currentItem,
});

export default connect(mapStateToProps, {
    getUser,
})(UserProfile);
