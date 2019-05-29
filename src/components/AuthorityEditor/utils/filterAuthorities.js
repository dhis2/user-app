/* eslint-disable max-params */

/** @module AuthorityEditor/utils/filterAuthorities */

const matchesSearchStr = (item, searchChunks) => {
    if (!searchChunks) {
        return true
    }
    const strToMatch = item.name.toLowerCase()

    return searchChunks.some(chunk => {
        // Ignore single characters when there are multiple chunks
        // because this makes the results list grow like crazy
        // i.e. this would be like the user typing "analytics t" and
        // this function returning true for all matches on "t"
        if (chunk.length <= 1 && searchChunks.length > 1) {
            return false
        }
        return strToMatch.indexOf(chunk) > -1
    })
}

const matchesSelectedSetting = (item, selectedOnly, lookup) => {
    if (!selectedOnly) {
        return true
    }

    if (item.items && item.items.length) {
        return item.items.some(subItem => lookup.get(subItem.id))
    } else {
        return Boolean(lookup.get(item.id))
    }
}

/**
 * Filters a list of all available authorities based on a search chunks and a selectedOnly flag
 * @param {Object} allAuthorities - A nested object in which all authorities have been grouped in a logical way
 * @param {Object} selectedItemsLookup - A lookup Map that can be used for quickly filtering selected authorities
 * @param {Array} searchChunks - A search string that has been split into an array by spaces
 * @param {Boolean} selectedOnly - Flag for only allowing selected items
 * @returns {Object} An object with the same structure as `allAuthorities` but containing filtered arrays of authorities
 */
const filterAuthorities = (
    allAuthorities,
    selectedItemsLookup,
    searchChunks,
    selectedOnly
) => {
    if (!searchChunks && !selectedOnly) {
        return allAuthorities
    }
    return Object.keys(allAuthorities).reduce((filtered, key) => {
        const section = allAuthorities[key]
        const filteredItems = section.items.filter(item => {
            const allowedBySearchStr = matchesSearchStr(item, searchChunks)
            const allowedBySelectedSetting = matchesSelectedSetting(
                item,
                selectedOnly,
                selectedItemsLookup
            )
            return allowedBySearchStr && allowedBySelectedSetting
        })
        filtered[key] = { ...section, items: filteredItems }
        return filtered
    }, {})
}

export default filterAuthorities
