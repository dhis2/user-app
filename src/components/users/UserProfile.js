import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import _ from '../../constants/lodash';
import { parseDateFromUTCString } from '../../utils';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Heading from 'd2-ui/lib/headings/Heading.component';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import IconLink from '../IconLink';
import ErrorMessage from '../ErrorMessage';
import { connect } from 'react-redux';
import { USER_PROFILE_DISPLAY_FIELD_CONFIG } from '../../constants/defaults';
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
        // TODO: if logic like this is needed elsewhere, move it to utils
        // If not, then this is an over engineered turd
        return USER_PROFILE_DISPLAY_FIELD_CONFIG.map((field, index) => {
            let {
                key,
                label,
                removeText,
                parseDate,
                nestedPropselector,
                parseArrayAsCommaDelimitedString,
            } = field;
            label = i18next.t(label);
            let value = user[key];

            if (nestedPropselector) {
                nestedPropselector.forEach(selector => {
                    value = value[selector];
                });
            }

            if (parseArrayAsCommaDelimitedString) {
                // Some nested lists come through as a modelCollection but others are already arrays
                if (typeof value.toArray === 'function') {
                    value = value.toArray();
                }
                value = value
                    .map(item => item[parseArrayAsCommaDelimitedString])
                    .join(', ');
            }

            if (value && removeText) {
                value = _.capitalize(value.replace(removeText, ''));
            }

            if (value && parseDate && typeof value === 'string') {
                value = parseDateFromUTCString(value);
            }

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
