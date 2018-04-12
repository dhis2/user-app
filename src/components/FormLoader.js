import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, CircularProgress } from 'material-ui';
import { connect } from 'react-redux';
import { getItem, initNewItem } from '../actions';
import { USER, USER_GROUP, USER_ROLE, DETAILS } from '../constants/entityTypes';
import Heading from 'd2-ui/lib/headings/Heading.component';
import IconLink from './IconLink';
import i18n from 'd2-i18n';
import _ from '../constants/lodash';
import ErrorMessage from './ErrorMessage';
import RoleForm from '../containers/RoleForm';
import GroupForm from '../containers/GroupForm';
import UserForm from '../containers/UserForm';
import { shortItemSelector } from '../selectors';

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
        this.formNotFoundErrorMsg = i18n.t(
            'There was an error getting the form:'
        );
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

    renderHeader() {
        const {
            match: { params: { id } },
            item,
            shortItem,
            entityType,
        } = this.props;
        const baseItem = item && item.id === id ? item : shortItem;
        const entityTxt = baseItem
            ? baseItem.modelDefinition.displayName
            : _.capitalize(entityType);
        const displayName = baseItem ? baseItem.displayName : '';
        const updateMsg = `${i18n.t('Update')} ${entityTxt}: ${displayName}`;
        const createMsg = `${i18n.t('Create new')} ${entityTxt}`;
        const msg = id ? updateMsg : createMsg;
        const link = baseItem
            ? `/${_.kebabCase(baseItem.modelDefinition.plural)}`
            : null;
        const linkTooltip = `${i18n.t('Back to')} ${entityTxt}s`;

        return (
            <Heading style={styles.heading}>
                <IconLink
                    to={link}
                    tooltip={linkTooltip}
                    disabled={true}
                    icon="arrow_back"
                />
                {msg}
            </Heading>
        );
    }

    renderContent() {
        const { match: { params: { id } }, item } = this.props;

        if (typeof item === 'string') {
            return (
                <ErrorMessage
                    introText={this.formNotFoundErrorMsg}
                    errorMessage={item}
                />
            );
        }

        if (!item || (item && item.id !== id)) {
            return (
                <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                    <CircularProgress />
                </div>
            );
        }

        return this.renderForm();
    }

    render() {
        return (
            <main style={styles.main}>
                {this.renderHeader()}
                <Paper style={styles.paper}>{this.renderContent()}</Paper>
            </main>
        );
    }
}

FormLoader.propTypes = {
    match: PropTypes.object.isRequired,
    entityType: PropTypes.string.isRequired,
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    shortItem: PropTypes.object,
    getItem: PropTypes.func.isRequired,
    initNewItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => {
    return {
        item: state.currentItem,
        // shortItem is available when navigating from a list but not after refesh
        shortItem: shortItemSelector(props.match.params.id, state.list.items),
    };
};

export default connect(mapStateToProps, {
    getItem,
    initNewItem,
})(FormLoader);
