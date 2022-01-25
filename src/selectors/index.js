import { memoize } from 'lodash-es'

/**
 * A short item is a basic version of state.currentItem, derived from a list.
 * It is used to display basic information in a FormLoader or DetailSummary component
 * while the full version of the currentItem is being fetched.
 * @param {String} id - The id of the model selected in a list
 * @param {Object} list - A d2  model collection instance instance (state.list)
 * @returns {Object} A d2 model instance containing only a few basic properties
 * @function
 */
export const shortItemSelector = memoize((id, list) => {
    if (!list || !id) {
        return null
    }
    return list.get(id)
})
