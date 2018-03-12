import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Heading from 'd2-ui/lib/headings/Heading.component';
import TextField from 'material-ui/TextField/TextField';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import SelectField from 'material-ui/SelectField/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import i18next from 'i18next';
import SearchableGroupEditor from '../../SearchableGroupEditor';
import SearchableOrgUnitTree from '../../SearchableOrgUnitTree';
import { navigateTo } from '../../../utils';
import api from '../../../api';
import { userFormInitialValuesSelector } from '../../../selectors';

import { getList, showSnackbar } from '../../../actions';
// import { USER } from '../../../constants/entityTypes';
import { asArray, getNestedProp } from '../../../utils';
import * as CONFIG from './config';

const validate = (values, props) => {
    console.log('in validate', values);
    return {};
};

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

        // Bind input rendering functions to this scope here and not in .renderFields
        // https://github.com/erikras/redux-form/issues/1094/#issuecomment-278915819
        this.renderTextField = this.renderTextField.bind(this);
        this.renderCheckbox = this.renderCheckbox.bind(this);
        this.renderSelectField = this.renderSelectField.bind(this);
        this.renderSearchableGroupEditor = this.renderSearchableGroupEditor.bind(this);
        this.renderSearchableOrgUnitTree = this.renderSearchableOrgUnitTree.bind(this);
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

    renderTextField({ input, label, meta: { touched, error }, ...other }) {
        return (
            <TextField
                floatingLabelText={label}
                hintText={label}
                fullWidth={true}
                {...other}
                {...input}
            />
        );
    }

    renderCheckbox({ input, label, meta: { touched, error }, ...other }) {
        return (
            <Checkbox
                checked={Boolean(input.value)}
                label={label}
                {...input}
                style={CONFIG.STYLES.checkbox}
            />
        );
    }

    renderSelectField({
        input,
        label,
        meta: { touched, error },
        optionsSelector,
        ...other
    }) {
        const options = getNestedProp(optionsSelector, this.state);
        return (
            <SelectField
                floatingLabelText={label}
                fullWidth={true}
                {...input}
                onChange={(event, index, value) => input.onChange(value)}
            >
                {options.map(({ locale, name }, i) => (
                    <MenuItem key={`option_${i}`} value={locale} primaryText={name} />
                ))}
            </SelectField>
        );
    }

    renderSearchableGroupEditor({
        input,
        meta: { touched, error },
        initialItemsSelector,
        availableItemsQuery,
        availableItemsLabel,
        assignedItemsLabel,
        ...other
    }) {
        const initialItems = initialItemsSelector(this.props.user);
        const availableItemsHeader = i18next.t(availableItemsLabel);
        const assignedItemsHeader = i18next.t(assignedItemsLabel);

        return (
            <SearchableGroupEditor
                initiallyAssignedItems={initialItems}
                onChange={input.onChange}
                availableItemsQuery={availableItemsQuery}
                availableItemsHeader={availableItemsHeader}
                assignedItemsHeader={assignedItemsHeader}
                {...other}
            />
        );
    }

    renderSearchableOrgUnitTree({
        input,
        label,
        meta: { touched, error },
        wrapperStyle,
        initialValuesPropName,
    }) {
        const initialValues = asArray(this.props.user[initialValuesPropName]);

        return (
            <SearchableOrgUnitTree
                selectedOrgUnits={initialValues}
                onChange={input.onChange}
                wrapperStyle={wrapperStyle}
                headerText={label}
            />
        );
    }

    renderText({ key, label, style }) {
        return (
            <p key={key} style={style}>
                {label}
            </p>
        );
    }

    renderFields(fields) {
        return fields.map((fieldConfig, index) => {
            const { name, component, label, ...other } = fieldConfig;
            const labelText = i18next.t(label);
            const componentRenderer = this[`render${component}`];

            if (component === 'Text') {
                return this.renderText(fieldConfig);
            }

            return (
                <Field
                    name={name}
                    key={name}
                    component={componentRenderer}
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
