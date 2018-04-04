import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import { connect } from 'react-redux';
import { getItem, initNewItem } from '../actions';
import { USER, USER_GROUP, USER_ROLE, DETAILS } from '../constants/entityTypes';
import Heading from 'd2-ui/lib/headings/Heading.component';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import IconLink from './IconLink';
import i18next from 'i18next';
import _ from '../constants/lodash';
import ErrorMessage from './ErrorMessage';
import RoleForm from './roles/RoleForm';
import GroupForm from './groups/GroupForm';
import UserForm from './users/UserForm';

const styles = {
    main: {
        width: '100%',
        paddingLeft: '2rem',
    },
    heading: {
        paddingBottom: '1rem',
    },
    paper: {
        padding: '2rem 5rem 4rem',
    },
};

class FormLoader extends Component {
    componentWillMount() {
        const {
            match: { params: { id } },
            item,
            getItem,
            initNewItem,
            entityType,
        } = this.props;
        if (id && !(item && item.id === id)) {
            getItem(entityType, DETAILS, id);
        } else if (!id) {
            initNewItem(entityType);
        }
        this.formNotFoundErrorMsg = i18next.t('There was an error getting the form:');
    }

    renderForm() {
        const { entityType } = this.props;
        switch (entityType) {
            case USER:
                return <UserForm />;
            case USER_ROLE:
                return <RoleForm />;
            case USER_GROUP:
                return <GroupForm />;
            default:
                return (
                    <ErrorMessage
                        introText={this.formNotFoundErrorMsg}
                        errorMessage={''}
                    />
                );
        }
    }

    render() {
        const { match: { params: { id } }, item } = this.props;

        if (!item || (item && item.id !== id)) {
            return <LoadingMask />;
        }

        if (typeof item === 'string') {
            return (
                <ErrorMessage introText={this.formNotFoundErrorMsg} errorMessage={item} />
            );
        }

        const entityTxt = item.modelDefinition.displayName;
        const updateMsg = `${i18next.t('Update')} ${entityTxt}: ${item.displayName}`;
        const createMsg = `${i18next.t('Create new')} ${entityTxt}`;
        const msg = id ? updateMsg : createMsg;
        const link = `/${_.kebabCase(item.modelDefinition.plural)}`;
        const linkTooltip = `${i18next.t('Back to')} ${entityTxt}s`;

        return (
            <main style={styles.main}>
                <Heading style={styles.heading}>
                    <IconLink to={link} tooltip={linkTooltip} icon="arrow_back" />
                    {msg}
                </Heading>
                <Paper style={styles.paper}>{this.renderForm()}</Paper>
            </main>
        );
    }
}

FormLoader.propTypes = {
    match: PropTypes.object.isRequired,
    entityType: PropTypes.string.isRequired,
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    getItem: PropTypes.func.isRequired,
    initNewItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    item: state.currentItem,
});

export default connect(mapStateToProps, {
    getItem,
    initNewItem,
})(FormLoader);
