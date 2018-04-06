import { blue600 } from 'material-ui/styles/colors';
import asArray from '../../utils/asArray';
import getNestedProp from '../../utils/getNestedProp';
import { analyticsDimensionsRestrictionsSelector } from '../../selectors';
import {
    renderTextField,
    renderCheckbox,
    renderSelectField,
    renderSearchableGroupEditor,
    renderSearchableOrgUnitTree,
    renderText,
} from '../../utils/fieldRenderers';

export const STYLES = {
    loaderWrap: {
        paddingTop: '2rem',
        textAlign: 'center',
    },
    toggler: {
        color: blue600,
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
export const ASSIGNED_ROLES = 'userRoles';
export const DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS = 'organisationUnits';
export const DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS = 'dataViewOrganisationUnits';
export const TEI_SEARCH_ORG_UNITS = 'teiSearchOrganisationUnits';
export const ASSIGNED_USER_GROUPS = 'userGroups';
export const DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS = 'catCogsDimensionConstraints';

export const USER_PROPS = [
    SURNAME,
    FIRST_NAME,
    EMAIL,
    PHONE_NUMBER,
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
    ASSIGNED_USER_GROUPS,
    TEI_SEARCH_ORG_UNITS,
];

export const USER_CRED_PROPS = [
    USERNAME,
    EXTERNAL_AUTH,
    PASSWORD,
    OPEN_ID,
    LDAP_ID,
    ASSIGNED_ROLES,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
];

export const ALWAYS_REQUIRED = 'ALWAYS_REQUIRED';
export const CREATE_REQUIRED = 'CREATE_REQUIRED';

export const USE_DB_LOCALE = 'use_db_locale';

const BASE_CAPTION = {
    label:
        'Selecting an organisation unit provides access to all units in the sub-hierarchy',
    fieldRenderer: renderText,
    style: {
        clear: 'both',
        paddingTop: '0.8rem',
        fontStyle: 'italic',
        fontSize: '0.9rem',
    },
};

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
        availableItemsQuery: 'getAvailableUserRoles',
        availableItemsLabel: 'Available roles',
        assignedItemsLabel: 'Selected roles',
    },
    {
        name: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        label: 'Data capture and maintenance organisation units',
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingRight: '60px' },
    },
    {
        name: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        label: 'Data output and analytic organisation units',
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingLeft: '60px' },
    },
    {
        ...BASE_CAPTION,
        name: 'org_unit_info_1',
    },
    {
        name: TEI_SEARCH_ORG_UNITS,
        label: 'Search Organisation Units',
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingRight: '60px' },
    },
    {
        ...BASE_CAPTION,
        name: 'org_unit_info_2',
    },
];

export const ADDITIONAL_FIELDS = [
    {
        name: ASSIGNED_USER_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user => asArray(user.userGroups) || [],
        availableItemsQuery: 'getAvailableUserGroups',
        availableItemsLabel: 'Available user groups',
        assignedItemsLabel: 'Selected user groups',
    },
    {
        name: DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user => analyticsDimensionsRestrictionsSelector(user),
        availableItemsQuery: 'getAvailableDataAnalyticsDimensionRestrictions',
        availableItemsLabel: 'Available dimension restrictions for data analytics',
        assignedItemsLabel: 'Selected dimension restrictions for data analytics',
        returnModelsOnUpdate: true,
    },
];
