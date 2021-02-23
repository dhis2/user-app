import { blue600 } from 'material-ui/styles/colors'
import asArray from '../../utils/asArray'
import i18n from '@dhis2/d2-i18n'
import getNestedProp from '../../utils/getNestedProp'
import { analyticsDimensionsRestrictionsSelector } from '../../selectors'
import {
    renderTextField,
    renderDateField,
    renderCheckbox,
    renderSelectField,
    renderSearchableGroupEditor,
    renderSearchableOrgUnitTree,
    renderText,
} from '../../utils/fieldRenderers'

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
}

export const FORM_NAME = 'userForm'
export const USERNAME = 'username'
export const EMAIL = 'email'
export const EXPIRE_DATE = 'accountExpiry'
export const DISABLED = 'disabled'
export const INVITE = 'inviteUser'
export const EXTERNAL_AUTH = 'externalAuth'
export const PASSWORD = 'password'
export const REPEAT_PASSWORD = 'repeatPassword'
export const SURNAME = 'surname'
export const FIRST_NAME = 'firstName'
export const OPEN_ID = 'openId'
export const LDAP_ID = 'ldapId'
export const PHONE_NUMBER = 'phoneNumber'
export const INTERFACE_LANGUAGE = 'interfaceLanguage'
export const DATABASE_LANGUAGE = 'databaseLanguage'
export const ASSIGNED_ROLES = 'userRoles'
export const DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS = 'organisationUnits'
export const DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS = 'dataViewOrganisationUnits'
export const TEI_SEARCH_ORG_UNITS = 'teiSearchOrganisationUnits'
export const ASSIGNED_USER_GROUPS = 'userGroups'
export const DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS =
    'catCogsDimensionConstraints'
export const WHATS_APP = 'whatsApp'
export const FACEBOOK_MESSENGER = 'facebookMessenger'
export const SKYPE = 'skype'
export const TELEGRAM = 'telegram'
export const TWITTER = 'twitter'

export const USER_PROPS = [
    SURNAME,
    FIRST_NAME,
    EMAIL,
    PHONE_NUMBER,
    WHATS_APP,
    FACEBOOK_MESSENGER,
    SKYPE,
    TELEGRAM,
    TWITTER,
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
    DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
    ASSIGNED_USER_GROUPS,
    TEI_SEARCH_ORG_UNITS,
]

export const USER_CRED_PROPS = [
    USERNAME,
    DISABLED,
    EXPIRE_DATE,
    EXTERNAL_AUTH,
    PASSWORD,
    OPEN_ID,
    LDAP_ID,
    ASSIGNED_ROLES,
    DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
]

export const ALWAYS_REQUIRED = 'ALWAYS_REQUIRED'
export const INVITE_REQUIRED = 'INVITE_REQUIRED'
export const CREATE_REQUIRED = 'CREATE_REQUIRED'

export const USE_DB_LOCALE = 'use_db_locale'

export const SET_PASSWORD = 'SET_PASSWORD'
export const INVITE_USER = 'INVITE_USER'

const getBaseCaption = () => ({
    label: i18n.t(
        'Selecting an organisation unit provides access to all units in the sub-hierarchy'
    ),
    fieldRenderer: renderText,
    style: {
        clear: 'both',
        paddingTop: '0.8rem',
        fontStyle: 'italic',
        fontSize: '0.9rem',
    },
})

export const getInviteFields = () => [
    {
        name: INVITE,
        label: i18n.t('Create account or email invitation'),
        fieldRenderer: renderSelectField,
        options: [
            {
                id: SET_PASSWORD,
                label: i18n.t('Create account with user details'),
            },
            {
                id: INVITE_USER,
                label: i18n.t('Email invitation to create account'),
            },
        ],
        props: {
            style: {
                // backgroundColor: 'rgb(110,188,253)',
            },
        },
    },
]

export const getBaseFields = () => [
    {
        name: USERNAME,
        label: i18n.t('Username'),
        fieldRenderer: renderTextField,
        isRequiredField: CREATE_REQUIRED,
    },
    {
        name: EMAIL,
        label: i18n.t('E-mail'),
        fieldRenderer: renderTextField,
        isRequiredField: INVITE_REQUIRED,
    },
    {
        name: EXTERNAL_AUTH,
        label: i18n.t('External authentication only (OpenID or LDAP)'),
        fieldRenderer: renderCheckbox,
    },
    {
        name: EXPIRE_DATE,
        label: i18n.t('Account expiration date'),
        fieldRenderer: renderDateField,
    },
    {
        name: DISABLED,
        label: i18n.t('Disabled'),
        fieldRenderer: renderCheckbox,
    },
    {
        name: PASSWORD,
        label: i18n.t('Password'),
        fieldRenderer: renderTextField,
        isRequiredField: CREATE_REQUIRED,
        props: {
            type: 'password',
            autoComplete: 'new-password',
        },
    },
    {
        name: REPEAT_PASSWORD,
        label: i18n.t('Retype password'),
        fieldRenderer: renderTextField,
        isRequiredField: CREATE_REQUIRED,
        props: {
            type: 'password',
            autoComplete: 'new-password',
        },
    },
    {
        name: SURNAME,
        label: i18n.t('Surname'),
        isRequiredField: ALWAYS_REQUIRED,
        fieldRenderer: renderTextField,
    },
    {
        name: FIRST_NAME,
        label: i18n.t('First name'),
        isRequiredField: ALWAYS_REQUIRED,
        fieldRenderer: renderTextField,
    },
    {
        name: OPEN_ID,
        label: i18n.t('OIDC mapping value'),
        fieldRenderer: renderTextField,
    },
    {
        name: LDAP_ID,
        label: i18n.t('LDAP identifier'),
        fieldRenderer: renderTextField,
    },
    {
        name: PHONE_NUMBER,
        label: i18n.t('Mobile phone number'),
        fieldRenderer: renderTextField,
    },
    {
        name: WHATS_APP,
        label: i18n.t('WhatsApp'),
        fieldRenderer: renderTextField,
    },
    {
        name: FACEBOOK_MESSENGER,
        label: i18n.t('Facebook Messenger'),
        fieldRenderer: renderTextField,
    },
    {
        name: SKYPE,
        label: i18n.t('Skype'),
        fieldRenderer: renderTextField,
    },
    {
        name: TELEGRAM,
        label: i18n.t('Telegram'),
        fieldRenderer: renderTextField,
    },
    {
        name: TWITTER,
        label: i18n.t('Twitter'),
        fieldRenderer: renderTextField,
    },
    {
        name: INTERFACE_LANGUAGE,
        label: i18n.t('Interface language'),
        fieldRenderer: renderSelectField,
        optionsSelector: 'locales.ui.available',
        isRequiredField: ALWAYS_REQUIRED,
    },
    {
        name: DATABASE_LANGUAGE,
        label: i18n.t('Database language'),
        fieldRenderer: renderSelectField,
        optionsSelector: 'locales.db.available',
        isRequiredField: ALWAYS_REQUIRED,
    },
    {
        name: ASSIGNED_ROLES,
        fieldRenderer: renderSearchableGroupEditor,
        isRequiredField: ALWAYS_REQUIRED,
        initialItemsSelector: user =>
            asArray(getNestedProp('userCredentials.userRoles', user) || []),
        availableItemsQuery: 'getAvailableUserRoles',
        availableItemsLabel: i18n.t('Available roles'),
        assignedItemsLabel: i18n.t('Selected roles'),
    },
    {
        name: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        label: i18n.t('Data capture and maintenance organisation units'),
        isRequiredField: ALWAYS_REQUIRED,
        orgUnitType: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingRight: '60px' },
    },
    {
        name: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        label: i18n.t('Data output and analytic organisation units'),
        orgUnitType: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingLeft: '60px' },
    },
    {
        ...getBaseCaption(),
        name: 'org_unit_info_1',
    },
]

export const getAdditionalFields = () => [
    {
        name: TEI_SEARCH_ORG_UNITS,
        label: i18n.t('Search Organisation Units'),
        orgUnitType: TEI_SEARCH_ORG_UNITS,
        fieldRenderer: renderSearchableOrgUnitTree,
        wrapperStyle: { ...STYLES.orgUnitTree, paddingRight: '60px' },
    },
    {
        ...getBaseCaption(),
        name: 'org_unit_info_2',
    },
    {
        name: ASSIGNED_USER_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user => asArray(user.userGroups) || [],
        availableItemsQuery: 'getAvailableUserGroups',
        availableItemsLabel: i18n.t('Available user groups'),
        assignedItemsLabel: i18n.t('Selected user groups'),
    },
    {
        name: DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user =>
            analyticsDimensionsRestrictionsSelector(user),
        availableItemsQuery: 'getAvailableDataAnalyticsDimensionRestrictions',
        availableItemsLabel: i18n.t(
            'Available dimension restrictions for data analytics'
        ),
        assignedItemsLabel: i18n.t(
            'Selected dimension restrictions for data analytics'
        ),
        returnModelsOnUpdate: true,
    },
]
