/** @module AuthorityEditor/utils/groupAuthorities */
import i18n from '@dhis2/d2-i18n';
import _ from '../../../constants/lodash';
import nameLookup from './authorityGroupNames';

// The next 3 constants are exported so they can be used by the AuthorityEditor component

// The target object to which the allAuths array will be mapped
export const EMPTY_GROUPED_AUTHORITIES = {
    metadata: {
        name: 'Metadata',
        items: null,
        headers: [
            'Name',
            'Add/Update Public',
            'Add/Update Private',
            'Delete',
            'External access',
        ],
    },
    apps: {
        name: i18n.t('Apps'),
        items: null,
        headers: ['Name'],
    },
    tracker: {
        name: i18n.t('Tracker'),
        items: null,
        headers: ['Name'],
    },
    importExport: {
        name: i18n.t('Import-Export'),
        items: null,
        headers: ['Name'],
    },
    operations: {
        name: i18n.t('Operations'),
        items: null,
        headers: ['Name'],
    },
    system: {
        name: i18n.t('System'),
        items: null,
        headers: ['Name'],
    },
};

// Suffixes and prefixes
export const PUBLIC_ADD_SUFFIX = '_PUBLIC_ADD';
export const PRIVATE_ADD_SUFFIX = '_PRIVATE_ADD';

const ADD_SUFFIX = '_ADD';
const DELETE_SUFFIX = '_DELETE';
const EXTERNAL_ACCESS_SUFFIX = '_EXTERNAL';
const APP_AUTH_PREFIX = 'M_';

// Suffix groups for lookups and group construction
const ALL_METADATA_SUFFIXES = [
    PUBLIC_ADD_SUFFIX,
    PRIVATE_ADD_SUFFIX,
    ADD_SUFFIX,
    DELETE_SUFFIX,
    EXTERNAL_ACCESS_SUFFIX,
];

// Blueprints for creating implicit options and empty cells
const EMPTY_GROUP_ITEM = {
    id: null,
    empty: true,
};
const IMPLICIT_GROUP_ITEM = {
    implicit: true,
};

// Metadata with implicit add and delete
const AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE = new Set([
    'F_CHART_PUBLIC_ADD',
    'F_DASHBOARD_PUBLIC_ADD',
    'F_EVENTCHART_PUBLIC_ADD',
    'F_EVENTREPORT_PUBLIC_ADD',
    'F_MAP_PUBLIC_ADD',
    'F_REPORTTABLE_PUBLIC_ADD',
]);

const AUTHORITY_GROUPS = {
    tracker: new Set([
        'F_PROGRAM_DASHBOARD_CONFIG_ADMIN',
        'F_PROGRAM_ENROLLMENT',
        'F_PROGRAM_ENROLLMENT_READ',
        'F_PROGRAM_UNENROLLMENT',
        'F_TRACKED_ENTITY_DATAVALUE_READ',
        'F_TRACKED_ENTITY_INSTANCE_SEARCH',
        'F_TRACKED_ENTITY_INSTANCE_SEARCH_IN_ALL_ORGUNITS',
        'F_TRACKED_ENTITY_UPDATE',
        'F_UNCOMPLETE_EVENT',
        'F_VIEW_EVENT_ANALYTICS',
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
    ]),
    operations: new Set([
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
    ]),
    system: new Set([
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
};

/**
 * This function receives an array of authorities and reduces this into an object that is grouped into
 * logical sections. This is done in a semi dynamic way by using pre- and suffixes in tandem
 * with hard-coded group definitions
 * @param {Object[]} authorities - The list of authorities that will be transformed
 * @param {string} authorities[].id - The identifier of an authority using UPPER_SNAKE_CASE containing patterns that can be used for grouping.
 * @param {string} authorities[].name - The display name of an authority.
 * @returns {Object} - The grouped authorities object
 */
const groupAuthorities = authorities => {
    // A lookup map that can be used to verify the existence of a particular authority ID in linear time
    const lookup = authorities.reduce((lookup, auth) => {
        lookup.set(auth.id, auth);
        return lookup;
    }, new Map());

    // The initial state of items in EMPTY_GROUPED_AUTHORITIES is null, which makes the authority sections render a loader
    // but the accumulator object passed into the reduce function below expects items to be empty arrays
    const groupedAuthorities = Object.keys(EMPTY_GROUPED_AUTHORITIES).reduce(
        (groupedBase, key) => {
            groupedBase[key] = { ...EMPTY_GROUPED_AUTHORITIES[key], items: [] };
            return groupedBase;
        },
        {}
    );

    // Append items to the groupedAuthorities accumulator and return the accumulated object
    return authorities.reduce((groupedAuthorities, auth) => {
        if (_.startsWith(auth.id, APP_AUTH_PREFIX)) {
            // Group under apps
            groupedAuthorities.apps.items.push(auth);
            lookup.delete(auth.id);
        } else if (hasNoGroupSuffix(auth)) {
            // Group under specified key-value section
            addToAuthoritySection(auth, groupedAuthorities, lookup);
        } else {
            const metadataGroup = createMetadataGroup(auth, lookup);

            if (metadataGroup) {
                // If any type of metadata group was created add it to the metadata items list
                groupedAuthorities.metadata.items.push(metadataGroup);
            } else if (lookup.get(auth.id)) {
                // If no metadata group was created, we are dealing with and authority which had a metadata suffix,
                // but actually was not a metadata authority
                addToAuthoritySection(auth, groupedAuthorities, lookup);
            }
        }
        return groupedAuthorities;
    }, groupedAuthorities);
};

/**
 * Checks if a given authority contains any group suffixes
 * @param {Object} auth - The authority which ID could contain a group suffix
 * @return {Boolean} - True if no group suffix was found in the auth id
 */
const hasNoGroupSuffix = auth => {
    return !ALL_METADATA_SUFFIXES.some(suffix => _.endsWith(auth.id, suffix));
};

/**
 * Receives an authority item and creates an authority metadata group based on suffixes
 * @param {Object} auth - The authority to group
 * @param {Object} suffixes - The list of authority suffixes to check against
 * @param {Object} lookup - The authority lookup map
 * @return {Object} group - A metadata authority group
 */
const createMetadataGroup = (auth, lookup) => {
    // Exit if authority is no longer in the lookup
    if (!lookup.get(auth.id)) {
        return null;
    }

    // The suffix of the the incoming authority, i.e. "F_CATEGORY_COMBO_DELETE" => "_DELETE"
    const authSuffix = ALL_METADATA_SUFFIXES.find(suffix => _.endsWith(auth.id, suffix));
    // The authority baseName, i.e. "F_CATEGORY_COMBO_DELETE" => "F_CATEGORY_COMBO"
    const baseName = auth.id.replace(authSuffix, '');

    // Some metadata authorities distinguish between PUBLIC_ADD and PRIVATE_ADD
    // Others only have a _ADD version which equates to PUBLIC_ADD and PRIVATE_ADD may be left empty
    const genericAdd = lookup.get(baseName + ADD_SUFFIX);

    // Some metadata authorities have an external access authority version. If not present this may be left empty
    const externalAccess = lookup.get(baseName + EXTERNAL_ACCESS_SUFFIX);

    // Some authorities do not have _ADD_PRIVATE and _DELETE siblings in the authority list
    // however, they do belong to the metadata section. If a role is granted ADD_PUBLIC rights it is also allowed
    // to ADD_PRIVATE and DELETE implicitly
    const hasImplicitAddPrivateAndDelete = AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE.has(
        baseName + PUBLIC_ADD_SUFFIX
    );

    // Set each authority item for the current authority group
    const publicAddAuth = genericAdd || lookup.get(baseName + PUBLIC_ADD_SUFFIX);
    const privateAddAuth = genericAdd
        ? EMPTY_GROUP_ITEM
        : hasImplicitAddPrivateAndDelete
            ? IMPLICIT_GROUP_ITEM
            : lookup.get(baseName + PRIVATE_ADD_SUFFIX);
    const deleteAuth = hasImplicitAddPrivateAndDelete
        ? IMPLICIT_GROUP_ITEM
        : lookup.get(baseName + DELETE_SUFFIX);
    const externalAccessAuth = externalAccess || EMPTY_GROUP_ITEM;

    // If any of these variable are undefined, the authority in question has an ID with a metadata suffix,
    // but is not actually a metadata authority. I.e. "F_ENROLLMENT_CASCADE_DELETE"
    if (!publicAddAuth || !privateAddAuth || !deleteAuth) {
        return null;
    }

    // Delete from lookup to prevent double entries
    ALL_METADATA_SUFFIXES.forEach(suffix => lookup.delete(baseName + suffix));

    return {
        name: nameLookup.get(baseName),
        items: [publicAddAuth, privateAddAuth, deleteAuth, externalAccessAuth],
    };
};

/**
 * Assigns non-app, non-metadata authorities to the correct section. If it cannot find a correct section it will be assigned to 'system'
 * @param {Object} auth - The authority to assign to a section
 * @param {Object} groupedAuthorities - The object to assign to
 * @param {Object} lookup - The authority lookup map
 */
const addToAuthoritySection = (auth, groupedAuthorities, lookup) => {
    const groupKey =
        Object.keys(AUTHORITY_GROUPS).find(groupKey =>
            AUTHORITY_GROUPS[groupKey].has(auth.id)
        ) || 'system';

    if (auth.id === 'ALL') {
        auth.name = nameLookup.get(auth.id);
    }

    groupedAuthorities[groupKey].items.push(auth);
    lookup.delete(auth.id);
};

export default groupAuthorities;
