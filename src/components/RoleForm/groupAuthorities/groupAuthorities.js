import i18n from '@dhis2/d2-i18n'
import { sortBy } from 'lodash-es'
import { createMetadataGroup } from './metadata.js'

const AUTHORITY_GROUPS = {
    tracker: new Set([
        'F_ENROLLMENT_CASCADE_DELETE',
        'F_IGNORE_TRACKER_REQUIRED_VALUE_VALIDATION',
        'F_PROGRAM_DASHBOARD_CONFIG_ADMIN',
        'F_PROGRAM_ENROLLMENT_READ',
        'F_PROGRAM_ENROLLMENT',
        'F_PROGRAM_RULE_MANAGEMENT',
        'F_PROGRAM_UNENROLLMENT',
        'F_TEI_CASCADE_DELETE',
        'F_TRACKED_ENTITY_DATAVALUE_READ',
        'F_TRACKED_ENTITY_INSTANCE_SEARCH_IN_ALL_ORGUNITS',
        'F_TRACKED_ENTITY_INSTANCE_SEARCH',
        'F_TRACKED_ENTITY_MERGE',
        'F_TRACKED_ENTITY_UPDATE',
        'F_TRACKER_IMPORTER_EXPERIMENTAL',
        'F_UNCOMPLETE_EVENT',
        'F_VIEW_EVENT_ANALYTICS',
        'F_CAPTURE_DATASTORE_UPDATE',
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

const APP_AUTH_PREFIX = 'M_'

const groupForAuthority = (auth) => {
    for (const [group, authorityIDs] of Object.entries(AUTHORITY_GROUPS)) {
        if (authorityIDs.has(auth.id)) {
            return group
        }
    }
    return 'system'
}

const sortGroupedAuthorities = (groupedAuthorities) => {
    const sortedGroupedAuthorities = {}
    for (const [group, items] of Object.entries(groupedAuthorities)) {
        sortedGroupedAuthorities[group] = sortBy(items, (item) =>
            item.name?.toLowerCase()
        )
    }
    return sortedGroupedAuthorities
}

// Receives an authority item and creates an authority metadata group based on
// suffixes
const groupAuthorities = (authorities) => {
    // A lookup map used to check if an authority still needs to be assigned
    // to a group in constant time. Used to ensure each authority is assigned
    // to only one group
    const lookup = authorities.reduce((lookup, auth) => {
        lookup.set(auth.id, auth)
        return lookup
    }, new Map())

    const groupedAuthorities = authorities.reduce(
        (groupedAuthorities, auth) => {
            if (auth.id === 'ALL') {
                auth.name = i18n.t('All (Full authority)')
            }

            if (!lookup.has(auth.id)) {
                // Do nothing if authority has already been removed from lookup
            } else if (auth.id.startsWith(APP_AUTH_PREFIX)) {
                groupedAuthorities.apps.push(auth)
            } else {
                const metadataGroup = createMetadataGroup(auth.id, lookup)
                if (metadataGroup) {
                    groupedAuthorities.metadata.push(metadataGroup)
                } else {
                    const group = groupForAuthority(auth)
                    groupedAuthorities[group].push(auth)
                }
            }

            lookup.delete(auth.id)
            return groupedAuthorities
        },
        {
            metadata: [],
            apps: [],
            tracker: [],
            importExport: [],
            system: [],
        }
    )

    return sortGroupedAuthorities(groupedAuthorities)
}

export default groupAuthorities
