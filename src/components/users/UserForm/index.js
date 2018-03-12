import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Heading from 'd2-ui/lib/headings/Heading.component';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import i18next from 'i18next';
import { navigateTo } from '../../../utils';
import api from '../../../api';
import { userFormInitialValuesSelector } from '../../../selectors';
import { getList, showSnackbar } from '../../../actions';
// import { USER } from '../../../constants/entityTypes';
import { asArray, getNestedProp } from '../../../utils';
import * as CONFIG from './config';
import validate from './validate';
import {
    renderText,
    renderSearchableOrgUnitTree,
    renderSearchableGroupEditor,
    renderSelectField,
} from './fieldRenderers';

class UserForm extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        getList: PropTypes.func.isRequired,
        showSnackbar: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
            locales: null,
        };
    }

    componentWillMount() {
        const { user, showSnackbar } = this.props;
        const username = user.id ? user.userCredentials.username : null;
        api
            .getSelectedAndAvailableLocales(username)
            .then(locales => {
                this.setState({ locales });
                this.props.change(CONFIG.INTERFACE_LANGUAGE, locales.ui.selected);
                this.props.change(CONFIG.DATABASE_LANGUAGE, locales.db.selected);
            })
            .catch(error => {
                const msg = 'Could not load the user data. Please refresh the page.';
                showSnackbar({ message: i18next.t(msg) });
            });
    }

    toggleShowMore() {
        this.setState({
            showMore: !this.state.showMore,
        });
    }

    updateUser() {
        console.log('weet ik veel');
    }

    backToList() {
        navigateTo('/users');
    }

    renderFields(fields) {
        return fields.map((fieldConfig, index) => {
            const { name, fieldRenderer, label, ...other } = fieldConfig;
            const labelText = i18next.t(label);

            if (fieldRenderer === renderText) {
                return renderText(fieldConfig);
            }

            switch (fieldRenderer) {
                case renderSearchableOrgUnitTree:
                    other.initialValues = asArray(
                        this.props.user[fieldConfig.initialValuesPropName]
                    );
                    break;
                case renderSearchableGroupEditor:
                    other.initialValues = fieldConfig.initialItemsSelector(
                        this.props.user
                    );
                    break;
                case renderSelectField:
                    other.options = getNestedProp(
                        fieldConfig.optionsSelector,
                        this.state
                    );
                    break;
                default:
                    break;
            }

            return (
                <Field
                    name={name}
                    key={name}
                    component={fieldRenderer}
                    label={labelText}
                    {...other}
                />
            );
        });
    }

    renderBaseFields() {
        return this.renderFields(CONFIG.BASE_FIELDS);
    }

    renderAdditionalFields(showMore) {
        if (!showMore) {
            return null;
        }
        return (
            <div style={CONFIG.STYLES.additionalFieldsWrap}>
                {this.renderFields(CONFIG.ADDITIONAL_FIELDS)}
            </div>
        );
    }

    renderToggler(showMore) {
        const togglerText = showMore
            ? i18next.t('Show fewer options')
            : i18next.t('Show more options');
        const icon = showMore ? (
            <HardwareKeyboardArrowUp />
        ) : (
            <HardwareKeyboardArrowDown />
        );

        return (
            <div style={CONFIG.STYLES.togglerWrap}>
                <FlatButton
                    onClick={this.toggleShowMore.bind(this)}
                    label={togglerText}
                    style={CONFIG.STYLES.toggler}
                    icon={icon}
                />
            </div>
        );
    }

    render() {
        const { handleSubmit } = this.props;
        const { showMore, locales } = this.state;

        if (!locales) {
            return (
                <div style={CONFIG.STYLES.loaderWrap}>
                    <CircularProgress />
                </div>
            );
        }

        return (
            <main>
                <Heading level={2}>{i18next.t('Details')}</Heading>
                <form onSubmit={handleSubmit(this.updateUser.bind(this))}>
                    {this.renderBaseFields()}
                    {this.renderAdditionalFields(showMore)}
                    {this.renderToggler(showMore)}
                    <div>
                        <RaisedButton
                            label={i18next.t('Save')}
                            type="submit"
                            primary={true}
                            disabled={false}
                            style={{ marginRight: '8px' }}
                        />
                        <RaisedButton
                            label={i18next.t('Cancel')}
                            onClick={this.backToList.bind(this)}
                        />
                    </div>
                </form>
            </main>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.currentItem,
        initialValues: userFormInitialValuesSelector(state.currentItem),
    };
};

const ReduxFormWrappedUserForm = reduxForm({
    form: 'userForm',
    validate,
})(UserForm);

export default connect(mapStateToProps, {
    showSnackbar,
    getList,
})(ReduxFormWrappedUserForm);
