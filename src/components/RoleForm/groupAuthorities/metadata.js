import i18n from '@dhis2/d2-i18n'

const GROUP_NAMES = {
    F_AGGREGATE_DATA_EXCHANGE: i18n.t('Aggregate Data Exchange'),
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
    F_EVENT_HOOK: i18n.t('Event Hook'),
    F_ROUTE: i18n.t('Route'),
}

// Metadata group suffixes
const PUBLIC_ADD_SUFFIX = '_PUBLIC_ADD'
const PRIVATE_ADD_SUFFIX = '_PRIVATE_ADD'
const ADD_SUFFIX = '_ADD'
const DELETE_SUFFIX = '_DELETE'
const EXTERNAL_ACCESS_SUFFIX = '_EXTERNAL'
const ALL_SUFFIXES = [
    PUBLIC_ADD_SUFFIX,
    PRIVATE_ADD_SUFFIX,
    ADD_SUFFIX,
    DELETE_SUFFIX,
    EXTERNAL_ACCESS_SUFFIX,
]

// Metadata with implicit add and delete
const AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE = new Set([
    'F_DASHBOARD_PUBLIC_ADD',
    'F_EVENTCHART_PUBLIC_ADD',
    'F_EVENTREPORT_PUBLIC_ADD',
    'F_MAP_PUBLIC_ADD',
    'F_VISUALIZATION_PUBLIC_ADD',
])

// Templates for creating implicit options and empty cells
const EMPTY_GROUP_ITEM = {
    empty: true,
}
const IMPLICIT_GROUP_ITEM = {
    implicit: true,
}

const hasMetadataGroupSuffix = (authID) =>
    ALL_SUFFIXES.some((suffix) => authID.endsWith(suffix))

export const getMetadataAuthBaseName = (authID) => {
    // The suffix of the the incoming authority, i.e. "F_CATEGORY_COMBO_DELETE" => "_DELETE"
    const authSuffix = ALL_SUFFIXES.find((suffix) => authID.endsWith(suffix))
    // The authority baseName, i.e. "F_CATEGORY_COMBO_DELETE" => "F_CATEGORY_COMBO"
    return authID.replace(new RegExp(`${authSuffix}$`), '')
}

/**
 * Receives an authority item and creates an authority metadata group based on suffixes
 * @param {Object} auth - The authority to group
 * @param {Map} lookup - The authority lookup map
 * @return {Object} A metadata authority group
 */
export const createMetadataGroup = (authID, lookup) => {
    if (!hasMetadataGroupSuffix(authID)) {
        return null
    }

    const baseName = getMetadataAuthBaseName(authID)

    // Some metadata authorities distinguish between PUBLIC_ADD and PRIVATE_ADD
    // Others only have a _ADD version which equates to PUBLIC_ADD and PRIVATE_ADD may be left empty
    const genericAdd = lookup.get(baseName + ADD_SUFFIX)

    // Some authorities do not have _ADD_PRIVATE and _DELETE siblings in the authority list
    // however, they do belong to the metadata section. If a role is granted ADD_PUBLIC rights it is also allowed
    // to ADD_PRIVATE and DELETE implicitly
    const hasImplicitAddPrivateAndDelete =
        AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE.has(
            baseName + PUBLIC_ADD_SUFFIX
        )

    // Set each authority item for the current authority group
    const addUpdatePublic =
        genericAdd || lookup.get(baseName + PUBLIC_ADD_SUFFIX)
    const addUpdatePrivate = genericAdd
        ? EMPTY_GROUP_ITEM
        : hasImplicitAddPrivateAndDelete
        ? IMPLICIT_GROUP_ITEM
        : lookup.get(baseName + PRIVATE_ADD_SUFFIX)
    const deleteAuth = hasImplicitAddPrivateAndDelete
        ? IMPLICIT_GROUP_ITEM
        : lookup.get(baseName + DELETE_SUFFIX)
    // Some metadata authorities have an external access authority version. If
    // not present this may be left empty
    const externalAccess =
        lookup.get(baseName + EXTERNAL_ACCESS_SUFFIX) || EMPTY_GROUP_ITEM

    // If any of these variable are undefined, the authority in question has an
    // ID with a metadata suffix, but is not actually a metadata authority.
    // i.e. "F_ENROLLMENT_CASCADE_DELETE"
    if (!addUpdatePublic || !addUpdatePrivate || !deleteAuth) {
        return null
    }

    // Delete from lookup to prevent double entries
    ALL_SUFFIXES.forEach((suffix) => lookup.delete(baseName + suffix))

    return {
        name: GROUP_NAMES[baseName] || baseName,
        addUpdatePublic,
        addUpdatePrivate,
        delete: deleteAuth,
        externalAccess,
    }
}
