// todo: delete file

import i18n from '@dhis2/d2-i18n'
import { analyticsDimensionsRestrictionsSelector } from '../../selectors'
import asArray from '../../utils/asArray'
import {
    renderTextField,
    renderDateField,
    renderCheckbox,
    renderSelectField,
    renderSearchableGroupEditor,
    renderSearchableOrgUnitTree,
    renderText,
} from '../../utils/fieldRenderers'
import getNestedProp from '../../utils/getNestedProp'

export const EXPIRE_DATE = 'accountExpiry' // done
export const DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS =
    'catCogsDimensionConstraints' // done
export const ASSIGNED_USER_GROUPS = 'userGroups' // done
export const EXTERNAL_AUTH = 'externalAuth' // done
export const INVITE = 'inviteUser' // done
export const DISABLED = 'disabled' // done
export const WHATS_APP = 'whatsApp' // done
export const USERNAME = 'username' // done
export const EMAIL = 'email' // done
export const PASSWORD = 'password' // done
export const REPEAT_PASSWORD = 'repeatPassword' // done
export const SURNAME = 'surname' // done
export const FIRST_NAME = 'firstName' // done
export const OPEN_ID = 'openId' // done
export const LDAP_ID = 'ldapId' // done
export const PHONE_NUMBER = 'phoneNumber' // done
export const INTERFACE_LANGUAGE = 'interfaceLanguage' // done
export const DATABASE_LANGUAGE = 'databaseLanguage' // done
export const ASSIGNED_ROLES = 'userRoles' // done
export const DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS = 'organisationUnits' // done
export const DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS = 'dataViewOrganisationUnits' // done
export const TEI_SEARCH_ORG_UNITS = 'teiSearchOrganisationUnits' // done
export const FACEBOOK_MESSENGER = 'facebookMessenger' // done
export const SKYPE = 'skype' // done
export const TELEGRAM = 'telegram' // done
export const TWITTER = 'twitter' // done

export const USER_PROPS = [
    SURNAME, // done
    FIRST_NAME, // done
    EMAIL, // done
    PHONE_NUMBER, // done
    WHATS_APP, // done
    FACEBOOK_MESSENGER, // done
    SKYPE, // done
    TELEGRAM, // done
    TWITTER, // done
    DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS, // done
    DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS, // done
    TEI_SEARCH_ORG_UNITS, // done
    ASSIGNED_USER_GROUPS, // done
]

export const USER_CRED_PROPS = [
    USERNAME, // done
    DISABLED, // done
    EXPIRE_DATE, // done
    EXTERNAL_AUTH, // done
    PASSWORD, // done
    OPEN_ID, // done
    LDAP_ID, // done
    ASSIGNED_ROLES, // done
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
        name: FIRST_NAME,
        label: i18n.t('First name'),
        isRequiredField: ALWAYS_REQUIRED,
        fieldRenderer: renderTextField,
    },
    {
        name: SURNAME,
        label: i18n.t('Last name'),
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
        availableItemsQuery: {
            availableItems: {
                resource: 'userRoles',
                params: {
                    canIssue: true,
                    fields: ['id', 'displayName'],
                    paging: false,
                },
            },
        },
        availableItemsLabel: i18n.t('Available roles'),
        assignedItemsLabel: i18n.t('Selected roles'),
    },
    {
        name: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        label: i18n.t('Data capture and maintenance organisation units'),
        isRequiredField: ALWAYS_REQUIRED,
        orgUnitType: DATA_CAPTURE_AND_MAINTENANCE_ORG_UNITS,
        fieldRenderer: renderSearchableOrgUnitTree,
        side: 'left',
    },
    {
        name: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        label: i18n.t('Data output and analytic organisation units'),
        orgUnitType: DATA_OUTPUT_AND_ANALYTICS_ORG_UNITS,
        fieldRenderer: renderSearchableOrgUnitTree,
        side: 'right',
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
        side: 'left',
    },
    {
        ...getBaseCaption(),
        name: 'org_unit_info_2',
    },
    {
        name: ASSIGNED_USER_GROUPS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user => asArray(user.userGroups) || [],
        availableItemsQuery: {
            availableItems: {
                resource: 'userGroups',
                params: {
                    fields: ['id', 'displayName'],
                    paging: false,
                },
            },
        },
        availableItemsLabel: i18n.t('Available user groups'),
        assignedItemsLabel: i18n.t('Selected user groups'),
    },
    {
        name: DIMENSION_RESTRICTIONS_FOR_DATA_ANALYTICS,
        fieldRenderer: renderSearchableGroupEditor,
        initialItemsSelector: user =>
            analyticsDimensionsRestrictionsSelector(user),
        availableItemsQuery: {
            availableItems: {
                resource: 'dimensions/constraints',
                params: {
                    fields: ['id', 'name', 'dimensionType'],
                    paging: false,
                },
            },
        },
        availableItemsLabel: i18n.t(
            'Available dimension restrictions for data analytics'
        ),
        assignedItemsLabel: i18n.t(
            'Selected dimension restrictions for data analytics'
        ),
        returnModelsOnUpdate: true,
    },
]
