const matchesSearchChunks = (item, searchChunks) => {
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

const matchesFilterSelectedOnly = (item, filterSelectedOnly, isSelected) => {
    if (!filterSelectedOnly) {
        return true
    }

    if (Array.isArray(item.items)) {
        return item.items.some(subItem => isSelected(subItem.id))
    } else {
        return isSelected(item.id)
    }
}

/**
 * Filters a list of all available authorities based on a search string and filterSelectedOnly flag
 * @param {Object} allGroupedAuthorities - A nested object in which all authorities have been grouped in a logical way
 * @param {Object} isSelected - A function to check selection with
 * @param {Array} searchChunks - A search string that has been split into an array by spaces
 * @param {Boolean} filterSelectedOnly - Flag for only allowing selected items
 * @returns {Object} An object with the same structure as `allGroupedAuthorities` but containing filtered arrays of authorities
 */
const filterAuthorities = ({
    allGroupedAuthorities,
    isSelected,
    searchChunks,
    filterSelectedOnly,
}) => {
    if (!searchChunks && !filterSelectedOnly) {
        return allGroupedAuthorities
    }
    return Object.entries(allGroupedAuthorities).reduce(
        (filtered, [sectionId, section]) => {
            const filteredItems = section.items.filter(
                item =>
                    matchesSearchChunks(item, searchChunks) &&
                    matchesFilterSelectedOnly(
                        item,
                        filterSelectedOnly,
                        isSelected
                    )
            )
            filtered[sectionId] = { ...section, items: filteredItems }
            return filtered
        },
        {}
    )
}

export { filterAuthorities }
