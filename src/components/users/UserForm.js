import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Heading from 'd2-ui/lib/headings/Heading.component';
import TextField from 'material-ui/TextField/TextField';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import SelectField from 'material-ui/SelectField/SelectField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import { blue600 } from 'material-ui/styles/colors';
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import i18next from 'i18next';
import SearchableGroupEditor from '../SearchableGroupEditor';
import SearchableOrgUnitTree from '../SearchableOrgUnitTree';
import { navigateTo } from '../../utils';
import api from '../../api';
import { getList, showSnackbar } from '../../actions';
import { USER } from '../../constants/entityTypes';
import { asArray, getNestedProp } from '../../utils';

const styles = {
    loaderWrap: {
        padding: '3rem',
        textAlign: 'center',
    },
    toggler: {
        marginBottom: '1.5rem',
        color: blue600,
    },
    checkbox: {
        marginTop: '32px',
    },
};

const USERNAME = 'username';
const EXTERNAL_AUTH_ONLY = 'externalAuthOnly';
const PASSWORD = 'password';
const REPEAT_PASSWORD = 'repeatPassword';
const SURNAME = 'surname';
const FIRST_NAME = 'firstName';
const EMAIL = 'email';
const OPEN_ID = 'openId';
const LDAP_IDENTIFIER = 'ldapIdentifier';
const PHONE = 'phone';
const INTERFACE_LANGUAGE = 'interfaceLanguage';
const DATABASE_LANGUAGE = 'databaseLanguage';
const ASSIGNED_ROLES = 'assignedRoles';
const DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS = 'dataCaptureAndMaintenanceOrgUnits';
const DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS = 'dataOutputAndAnalyticsOrgUnits';
const ASSIGNED_USER_GROUPS = 'assignedUserGroups';
const DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS = 'dimensionRestrictionsForDataAnalytics';

const BASE_FIELDS = [
    {
        name: USERNAME,
        label: 'Username',
        component: 'TextField',
        required: true,
    },
    {
        name: EXTERNAL_AUTH_ONLY,
        label: 'External authentication only (OpenID or LDAP)',
        component: 'Checkbox',
    },
    {
        name: PASSWORD,
        label: 'Password',
        component: 'TextField',
        props: {
            type: 'password',
        },
    },
    {
        name: REPEAT_PASSWORD,
        label: 'Retype password',
        component: 'TextField',
        props: {
            type: 'password',
        },
    },
    {
        name: SURNAME,
        label: 'Surname',
        component: 'TextField',
    },
    {
        name: FIRST_NAME,
        label: 'First name',
        component: 'TextField',
    },
    {
        name: EMAIL,
        label: 'E-mail',
        component: 'TextField',
    },
    {
        name: OPEN_ID,
        label: 'openID',
        component: 'TextField',
    },
    {
        name: LDAP_IDENTIFIER,
        label: 'LDAP Identifier',
        component: 'TextField',
    },
    {
        name: PHONE,
        label: 'Mobile phone number',
        component: 'TextField',
    },
    {
        name: INTERFACE_LANGUAGE,
        label: 'Interface language',
        component: 'SelectField',
        optionsSelector: 'locales.ui',
    },
    {
        name: DATABASE_LANGUAGE,
        label: 'Database language',
        component: 'SelectField',
        optionsSelector: 'locales.db',
    },
    {
        name: ASSIGNED_ROLES,
        component: 'SearchableGroupEditor',
        initialItemsSelector: 'userCredentials.userRoles',
        availableItemsQuery: api.getAvailableUserRoles,
        availableItemsLabel: 'Available roles',
        assignedItemsLabel: 'Selected roles',
    },
    {
        name: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        label: 'dataCaptureAndMaintenanceOrgUnits',
        component: 'SearchableOrgUnitTree',
    },
    {
        name: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        label: 'dataOutputAndAnalyticsOrgUnits',
        component: 'SearchableOrgUnitTree',
    },
];

const ADDITIONAL_FIELDS = [
    {
        name: ASSIGNED_USER_GROUPS,
        component: 'SearchableGroupEditor',
        initialItemsSelector: 'userGroups',
        availableItemsQuery: api.getAvailableUsergroups,
        availableItemsLabel: 'Available user groups',
        assignedItemsLabel: 'Selected user groups',
    },
    {
        name: DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
        component: 'SearchableGroupEditor',
        initialItemsSelector: 'userCredentials.catDimensionConstraints',
        availableItemsQuery: api.getAvailableDataAnalyticsDimensionRestrictions,
        availableItemsLabel: 'Available dimension restrictions for data analytics',
        assignedItemsLabel: 'Selected dimension restrictions for data analytics',
    },
];

const validate = (values, props) => {
    console.log('in validate', values, props);
    return {};
};

class UserForm extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        getList: PropTypes.func.isRequired,
        showSnackbar: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
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
        api.getAvailableLocales().then(locales => {
            this.setState({
                locales,
            });
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
        return <Checkbox label={label} {...input} style={styles.checkbox} />;
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
    }) {
        const initialItems = asArray(
            getNestedProp(initialItemsSelector, this.props.user) || []
        );
        const availableItemsHeader = i18next.t(availableItemsLabel);
        const assignedItemsHeader = i18next.t(assignedItemsLabel);

        return (
            <SearchableGroupEditor
                initiallyAssignedItems={initialItems}
                onChange={input.onChange}
                availableItemsQuery={availableItemsQuery}
                availableItemsHeader={availableItemsHeader}
                assignedItemsHeader={assignedItemsHeader}
            />
        );
    }

    renderSearchableOrgUnitTree() {
        return <p>renderSearchableOrgUnitTree</p>;
    }

    renderFields(fields) {
        return fields.map((fieldConfig, index) => {
            const { name, component, label, ...other } = fieldConfig;
            const labelText = i18next.t(label);
            const componentRenderer = this[`render${component}`];

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
        return this.renderFields(BASE_FIELDS);
    }

    renderAdditionalFields(showMore) {
        if (!showMore) {
            return null;
        }
        return this.renderFields(ADDITIONAL_FIELDS);
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
            <FlatButton
                onClick={this.toggleShowMore.bind(this)}
                label={togglerText}
                style={styles.toggler}
                icon={icon}
            />
        );
    }

    render() {
        const { handleSubmit } = this.props;
        const { showMore, locales } = this.state;

        if (!locales) {
            return (
                <div style={styles.loaderWrap}>
                    <CircularProgress />
                </div>
            );
        }

        return (
            <main>
                <Heading level={2}>{i18next.t('Details')}</Heading>
                <Divider />
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

const mapStateToProps = state => ({
    user: state.currentItem,
});

const ReduxFormWrappedUserForm = reduxForm({
    form: 'userForm',
    validate,
})(UserForm);

export default connect(mapStateToProps, {
    showSnackbar,
    getList,
})(ReduxFormWrappedUserForm);
