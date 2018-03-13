import { blue600 } from 'material-ui/styles/colors';
import { asArray, getNestedProp } from '../../../utils';
import api from '../../../api';
import { analyticsDimensionsRestrictionsSelector } from '../../../selectors';
import {
    renderTextField,
    renderCheckbox,
    renderSelectField,
    renderSearchableGroupEditor,
    renderSearchableOrgUnitTree,
    renderText,
} from './fieldRenderers';

export const STYLES = {
    loaderWrap: {
        padding: '3rem',
        textAlign: 'center',
    },
    toggler: {
        color: blue600,
    },
    checkbox: {
        marginTop: '32px',
    },
    orgUnitTree: {
        width: 'calc(50% - 60px)',
        float: 'left',
        minHeight: '100px',
        maxHeight: '1200px',
    },
    togglerWrap: {
        clear: 'both',
        paddingTop: '1.2rem',
        marginBottom: '1.5rem',
    },
    additionalFieldsWrap: {
        clear: 'both',
        paddingTop: '1.5rem',
    },
};

export const USERNAME = 'username';
export const EXTERNAL_AUTH = 'externalAuth';
export const PASSWORD = 'password';
export const REPEAT_PASSWORD = 'repeatPassword';
export const SURNAME = 'surname';
export const FIRST_NAME = 'firstName';
export const EMAIL = 'email';
export const OPEN_ID = 'openId';
export const LDAP_ID = 'ldapId';
export const PHONE_NUMBER = 'phoneNumber';
export const INTERFACE_LANGUAGE = 'interfaceLanguage';
export const DATABASE_LANGUAGE = 'databaseLanguage';
export const ASSIGNED_ROLES = 'assignedRoles';
export const DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS = 'dataCaptureAndMaintenanceOrgUnits';
export const DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS = 'dataOutputAndAnalyticsOrgUnits';
export const ASSIGNED_USER_GROUPS = 'assignedUserGroups';
export const DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS =
    'dimensionRestrictionsForDataAnalytics';

export const USER_PROPS = [SURNAME, FIRST_NAME, EMAIL, PHONE_NUMBER];
export const USER_CRED_PROPS = [USERNAME, OPEN_ID, LDAP_ID, EXTERNAL_AUTH];

export const ALWAYS_REQUIRED = 'ALWAYS_REQUIRED';
export const CREATE_REQUIRED = 'CREATE_REQUIRED';

export const BASE_FIELDS = [
    {
        name: USERNAME,
        label: 'Username',
        fieldRenderer: renderTextField,
        isRequiredField: CREATE_REQUIRED,
    },
    {
        name: EXTERNAL_AUTH,
        label: 'External authentication only (OpenID or LDAP)',
        fieldRenderer: renderCheckbox,
    },
    {
        name: PASSWORD,
        label: 'Password',
        fieldRenderer: renderTextField,
        isRequiredField: CREATE_REQUIRED,
        props: {
            type: 'password',
        },
    },
    {
        name: REPEAT_PASSWORD,
        label: 'Retype password',
        fieldRenderer: renderTextField,
        isRequiredField: CREATE_REQUIRED,
        props: {
            type: 'password',
        },
    },
    {
        name: SURNAME,
        label: 'Surname',
        isRequiredField: ALWAYS_REQUIRED,
        fieldRenderer: renderTextField,
    },
    {
        name: FIRST_NAME,
        label: 'First name',
        isRequiredField: ALWAYS_REQUIRED,
        fieldRenderer: renderTextField,
    },
    {
        name: EMAIL,
        label: 'E-mail',
        fieldRenderer: renderTextField,
    },
    {
        name: OPEN_ID,
        label: 'openID',
        fieldRenderer: renderTextField,
    },
    {
        name: LDAP_ID,
        label: 'LDAP Identifier',
        fieldRenderer: renderTextField,
    },
    {
        name: PHONE_NUMBER,
        label: 'Mobile phone number',
        fieldRenderer: renderTextField,
    },
    {
        name: INTERFACE_LANGUAGE,
        label: 'Interface language',
        fieldRenderer: renderSelectField,
        optionsSelector: 'locales.ui.available',
    },
    {
        name: DATABASE_LANGUAGE,
        label: 'Database language',
        fieldRenderer: renderSelectField,
        optionsSelector: 'locales.db.available',
    },
    {
        name: ASSIGNED_ROLES,
        fieldRenderer: renderSearchableGroupEditor,
        isRequiredField: ALWAYS_REQUIRED,
        initialItemsSelector: user =>
            asArray(getNestedProp('userCredentials.userRoles', user) || []),
        availableItemsQuery: api.getAvailableUserRoles,
        availableItemsLabel: 'Available roles',
        assignedItemsLabel: 'Selected roles',
    },
    {
        name: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        label: 'Data capture and maintenance organisation units',
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingRight: '60px' },
        userPropName: 'organisationUnits',
    },
    {
        name: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        label: 'Data output and analytic organisation units',
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingLeft: '60px' },
        userPropName: 'dataViewOrganisationUnits',
    },
    {
        name: 'org_unit_info',
        label:
            'Selecting an organisation unit provides access to all units in the sub-hierarchy',
        fieldRenderer: renderText,
        style: {
            clear: 'both',
            paddingTop: '0.8rem',
            fontStyle: 'italic',
            fontSize: '0.9rem',
        },
    },
];

export const ADDITIONAL_FIELDS = [
    {
        name: ASSIGNED_USER_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user => asArray(user.userGroups) || [],
        availableItemsQuery: api.getAvailableUsergroups,
        availableItemsLabel: 'Available user groups',
        assignedItemsLabel: 'Selected user groups',
    },
    {
        name: DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user => analyticsDimensionsRestrictionsSelector(user),
        availableItemsQuery: api.getAvailableDataAnalyticsDimensionRestrictions,
        availableItemsLabel: 'Available dimension restrictions for data analytics',
        assignedItemsLabel: 'Selected dimension restrictions for data analytics',
        returnModelsOnUpdate: true,
    },
];
