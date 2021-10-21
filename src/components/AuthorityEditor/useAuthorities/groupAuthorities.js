import endsWith from 'lodash.endswith'
import sortBy from 'lodash.sortby'
import startsWith from 'lodash.startswith'
import {
    AUTHORITY_GROUP_NAMES,
    PUBLIC_ADD_SUFFIX,
    PRIVATE_ADD_SUFFIX,
    ADD_SUFFIX,
    DELETE_SUFFIX,
    EXTERNAL_ACCESS_SUFFIX,
    APP_AUTH_PREFIX,
    ALL_METADATA_SUFFIXES,
    EMPTY_GROUP_ITEM,
    IMPLICIT_GROUP_ITEM,
    AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE,
    AUTHORITY_GROUPS,
    EMPTY_AUTHORITY_SECTIONS,
} from './constants.js'

const sortGroupedAuthorities = groupedAuthories => {
    Object.keys(groupedAuthories).forEach(key => {
        const group = groupedAuthories[key]
        group.items = sortBy(group.items, 'name')
    })
    return groupedAuthories
}

/**
 * Checks if a given authority contains any group suffixes
 * @param {Object} auth - The authority which ID could contain a group suffix
 * @return {Boolean} - True if no group suffix was found in the auth id
 */
const hasNoGroupSuffix = auth => {
    return !ALL_METADATA_SUFFIXES.some(suffix => endsWith(auth.id, suffix))
}

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
        return null
    }

    // The suffix of the the incoming authority, i.e. "F_CATEGORY_COMBO_DELETE" => "_DELETE"
    const authSuffix = ALL_METADATA_SUFFIXES.find(suffix =>
        endsWith(auth.id, suffix)
    )
    // The authority baseName, i.e. "F_CATEGORY_COMBO_DELETE" => "F_CATEGORY_COMBO"
    const baseName = auth.id.replace(authSuffix, '')

    // Some metadata authorities distinguish between PUBLIC_ADD and PRIVATE_ADD
    // Others only have a _ADD version which equates to PUBLIC_ADD and PRIVATE_ADD may be left empty
    const genericAdd = lookup.get(baseName + ADD_SUFFIX)

    // Some metadata authorities have an external access authority version. If not present this may be left empty
    const externalAccess = lookup.get(baseName + EXTERNAL_ACCESS_SUFFIX)

    // Some authorities do not have _ADD_PRIVATE and _DELETE siblings in the authority list
    // however, they do belong to the metadata section. If a role is granted ADD_PUBLIC rights it is also allowed
    // to ADD_PRIVATE and DELETE implicitly
    const hasImplicitAddPrivateAndDelete =
        AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE.has(
            baseName + PUBLIC_ADD_SUFFIX
        )

    // Set each authority item for the current authority group
    const publicAddAuth = genericAdd || lookup.get(baseName + PUBLIC_ADD_SUFFIX)
    const privateAddAuth = genericAdd
        ? EMPTY_GROUP_ITEM
        : hasImplicitAddPrivateAndDelete
        ? IMPLICIT_GROUP_ITEM
        : lookup.get(baseName + PRIVATE_ADD_SUFFIX)
    const deleteAuth = hasImplicitAddPrivateAndDelete
        ? IMPLICIT_GROUP_ITEM
        : lookup.get(baseName + DELETE_SUFFIX)
    const externalAccessAuth = externalAccess || EMPTY_GROUP_ITEM

    // If any of these variable are undefined, the authority in question has an ID with a metadata suffix,
    // but is not actually a metadata authority. I.e. "F_ENROLLMENT_CASCADE_DELETE"
    if (!publicAddAuth || !privateAddAuth || !deleteAuth) {
        return null
    }

    // Delete from lookup to prevent double entries
    ALL_METADATA_SUFFIXES.forEach(suffix => lookup.delete(baseName + suffix))

    return {
        name: AUTHORITY_GROUP_NAMES[baseName] || baseName,
        items: [publicAddAuth, privateAddAuth, deleteAuth, externalAccessAuth],
    }
}

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
        ) || 'system'

    if (auth.id === 'ALL') {
        auth.name = AUTHORITY_GROUP_NAMES[auth.id]
    }

    groupedAuthorities[groupKey].items.push(auth)
    lookup.delete(auth.id)
}

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
        lookup.set(auth.id, auth)
        return lookup
    }, new Map())

    // Append items to the groupedAuthorities accumulator and return the accumulated object
    const groupedAuthories = authorities.reduce(
        (groupedAuthorities, auth) => {
            if (startsWith(auth.id, APP_AUTH_PREFIX)) {
                // Group under apps
                groupedAuthorities.apps.items.push(auth)
                lookup.delete(auth.id)
            } else if (hasNoGroupSuffix(auth)) {
                // Group under specified key-value section
                addToAuthoritySection(auth, groupedAuthorities, lookup)
            } else {
                const metadataGroup = createMetadataGroup(auth, lookup)

                if (metadataGroup) {
                    // If any type of metadata group was created add it to the metadata items list
                    groupedAuthorities.metadata.items.push(metadataGroup)
                } else if (lookup.get(auth.id)) {
                    // If no metadata group was created, we are dealing with and authority which had a metadata suffix,
                    // but actually was not a metadata authority
                    addToAuthoritySection(auth, groupedAuthorities, lookup)
                }
            }
            return groupedAuthorities
        },
        { ...EMPTY_AUTHORITY_SECTIONS }
    )

    return sortGroupedAuthorities(groupedAuthories)
}

/*
 * This is needed when navigating from the list to the form,
 * because the function is called several times under these
 * conditions. This results in dupliocate items. I am unsure why
 * this is happening, but at least this does fix it.
 * TODO: hopefully this can be removed after further refactoring
 * the user-role form. In theory we should just be able to
 * directly use `groupAuthorities`.
 */
const createGroupAutoritiesWithCachedReturnValue = () => {
    let cachedResult
    return authorities => {
        if (!cachedResult) {
            cachedResult = groupAuthorities(authorities)
        }
        return cachedResult
    }
}

const groupAutoritiesWithCachedReturnValue =
    createGroupAutoritiesWithCachedReturnValue()

export { groupAutoritiesWithCachedReturnValue as groupAuthorities }
