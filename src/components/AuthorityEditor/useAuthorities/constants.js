import i18n from '@dhis2/d2-i18n'

export const METADATA = 'metadata'

export const AUTHORITY_GROUP_NAMES = {
    ALL: i18n.t('All (Full authority)'),
    F_ANALYTICSTABLEHOOK: i18n.t('Analytics Table Hook'),
    F_ATTRIBUTE: i18n.t('Attribute'),
    F_CATEGORY_COMBO: i18n.t('Category Combo'),
    F_CATEGORY: i18n.t('Category'),
    F_CATEGORY_OPTION: i18n.t('Category Option'),
    F_CATEGORY_OPTION_GROUP: i18n.t('Category Option Group'),
    F_CATEGORY_OPTION_GROUP_SET: i18n.t('Category Option Group Set'),
    F_COLOR_SET: i18n.t('Color Set'),
    F_CONSTANT: i18n.t('Constant'),
    F_DASHBOARD: i18n.t('Dashboard'),
    F_DATAELEMENTGROUPSET: i18n.t('Data Element Group Sets'),
    F_DATAELEMENTGROUP: i18n.t('Data Element Groups'),
    F_DATAELEMENT: i18n.t('Data Element'),
    F_DATAELEMENT_MINMAX: i18n.t('Min/max rule'),
    F_DATASET: i18n.t('Data Set'),
    F_DATAVALUE: i18n.t('Data Value'),
    F_DOCUMENT: i18n.t('Document'),
    F_EVENTCHART: i18n.t('Event Chart'),
    F_EVENTREPORT: i18n.t('Event Report'),
    F_EXTERNAL_MAP_LAYER: i18n.t('External Map Layer'),
    F_INDICATORGROUPSET: i18n.t('Indicator Group Sets'),
    F_INDICATORGROUP: i18n.t('Indicator Group'),
    F_INDICATORTYPE: i18n.t('Indicator Type'),
    F_INDICATOR: i18n.t('Indicator'),
    F_LEGEND_SET: i18n.t('Legend Set'),
    F_MAP: i18n.t('Map'),
    F_MINMAX_DATAELEMENT: i18n.t('Min-Max Data Element'),
    F_OPTIONGROUPSET: i18n.t('Option Group Set'),
    F_OPTIONGROUP: i18n.t('Option Group'),
    F_OPTIONSET: i18n.t('Option Set'),
    F_ORGANISATIONUNIT: i18n.t('Organisation Unit'),
    F_ORGUNITGROUPSET: i18n.t('Organisation Unit Group Set'),
    F_ORGUNITGROUP: i18n.t('Organisation Unit Group'),
    F_PREDICTOR: i18n.t('Predictor'),
    F_PROGRAMSTAGE: i18n.t('Program Stage'),
    F_PROGRAM: i18n.t('Program'),
    F_PROGRAM_INDICATOR: i18n.t('Program Indicator'),
    F_PROGRAM_INDICATOR_GROUP: i18n.t('Program Indicator Group'),
    F_PROGRAM_RULE: i18n.t('Program Rule'),
    F_PROGRAM_TRACKED_ENTITY_ATTRIBUTE_GROUP: i18n.t(
        'Program Tracked Entity Attribute Group'
    ),
    F_PUSH_ANALYSIS: i18n.t('Push Analysis'),
    F_RELATIONSHIPTYPE: i18n.t('Relationship Type'),
    F_REPORT: i18n.t('Report'),
    F_SECTION: i18n.t('Section'),
    F_SQLVIEW: i18n.t('SQL View'),
    F_TRACKED_ENTITY: i18n.t('Tracked Entity'),
    F_TRACKED_ENTITY_ATTRIBUTE: i18n.t('Tracked Entity Attribute'),
    F_TRACKED_ENTITY_DATAVALUE: i18n.t('Tracked Entity Data Value'),
    F_TRACKED_ENTITY_INSTANCE: i18n.t('Tracked Entity Instance'),
    F_USERGROUP: i18n.t('User Group'),
    F_USERROLE: i18n.t('User Role'),
    F_USER: i18n.t('User'),
    F_VALIDATIONRULEGROUP: i18n.t('Validation Rule Group'),
    F_VALIDATIONRULE: i18n.t('Validation Rule'),
    F_PREDICTORGROUP: i18n.t('Data predictor group'),
    F_SKIP_DATA_IMPORT_AUDIT: i18n.t('Skip data import audit'),
    F_VISUALIZATION: i18n.t('Visualization'),
}

// Suffixes and prefixes
export const PUBLIC_ADD_SUFFIX = '_PUBLIC_ADD'
export const PRIVATE_ADD_SUFFIX = '_PRIVATE_ADD'
export const ADD_SUFFIX = '_ADD'
export const DELETE_SUFFIX = '_DELETE'
export const EXTERNAL_ACCESS_SUFFIX = '_EXTERNAL'
export const APP_AUTH_PREFIX = 'M_'

// Suffix groups for lookups and group construction
export const ALL_METADATA_SUFFIXES = [
    PUBLIC_ADD_SUFFIX,
    PRIVATE_ADD_SUFFIX,
    ADD_SUFFIX,
    DELETE_SUFFIX,
    EXTERNAL_ACCESS_SUFFIX,
]

// Blueprints for creating implicit options and empty cells
export const EMPTY_GROUP_ITEM = {
    id: null,
    empty: true,
}
export const IMPLICIT_GROUP_ITEM = {
    implicit: true,
}

// Metadata with implicit add and delete
export const AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE = new Set([
    'F_DASHBOARD_PUBLIC_ADD',
    'F_EVENTCHART_PUBLIC_ADD',
    'F_EVENTREPORT_PUBLIC_ADD',
    'F_MAP_PUBLIC_ADD',
    'F_VISUALIZATION_PUBLIC_ADD',
])

export const AUTHORITY_GROUPS = {
    tracker: new Set([
        'F_PROGRAM_DASHBOARD_CONFIG_ADMIN',
        'F_PROGRAM_ENROLLMENT',
        'F_PROGRAM_ENROLLMENT_READ',
        'F_PROGRAM_UNENROLLMENT',
        'F_TEI_CASCADE_DELETE',
        'F_TRACKED_ENTITY_DATAVALUE_READ',
        'F_TRACKED_ENTITY_INSTANCE_SEARCH',
        'F_TRACKED_ENTITY_INSTANCE_SEARCH_IN_ALL_ORGUNITS',
        'F_TRACKED_ENTITY_UPDATE',
        'F_UNCOMPLETE_EVENT',
        'F_VIEW_EVENT_ANALYTICS',
        'F_PROGRAM_RULE_MANAGEMENT',
        'F_ENROLLMENT_CASCADE_DELETE',
    ]),
    importExport: new Set([
        'F_EXPORT_DATA',
        'F_EXPORT_EVENTS',
        'F_IMPORT_DATA',
        'F_IMPORT_EVENTS',
        'F_IMPORT_GML',
        'F_METADATA_EXPORT',
        'F_METADATA_IMPORT',
        'F_METADATA_MANAGE',
        'F_SKIP_DATA_IMPORT_AUDIT',
    ]),
    system: new Set([
        'ALL',
        'F_APPROVE_DATA',
        'F_APPROVE_DATA_LOWER_LEVELS',
        'F_ACCEPT_DATA_LOWER_LEVELS',
        'F_VIEW_UNAPPROVED_DATA',
        'F_ORGANISATIONUNIT_MOVE',
        'F_ORGANISATIONUNITLEVEL_UPDATE',
        'F_RUN_VALIDATION',
        'F_REPLICATE_USER',
        'F_USER_VIEW',
        'F_USERGROUP_MANAGING_RELATIONSHIPS_ADD',
        'F_USERGROUP_MANAGING_RELATIONSHIPS_VIEW',
        'F_PERFORM_MAINTENANCE',
        'F_SCHEDULING_ADMIN',
        'F_GENERATE_MIN_MAX_VALUES',
        'F_PREDICTOR_RUN',
        'F_INSERT_CUSTOM_JS_CSS',
        'F_SYSTEM_SETTING',
        'F_SEND_EMAIL',
        'F_MOBILE_SETTINGS',
        'F_MOBILE_SENDSMS',
        'F_OAUTH2_CLIENT_MANAGE',
    ]),
}

export const EMPTY_AUTHORITY_SECTIONS = {
    metadata: {
        id: METADATA,
        name: i18n.t('Metadata'),
        headers: [
            i18n.t('Name'),
            i18n.t('Add/Update Public'),
            i18n.t('Add/Update Private'),
            i18n.t('Delete'),
            i18n.t('External access'),
        ],
    },
    apps: {
        name: i18n.t('Apps'),
        headers: [i18n.t('Name')],
    },
    tracker: {
        name: i18n.t('Tracker'),
        headers: [i18n.t('Name')],
    },
    importExport: {
        name: i18n.t('Import-Export'),
        headers: [i18n.t('Name')],
    },
    system: {
        name: i18n.t('System'),
        headers: [i18n.t('Name')],
    },
}
