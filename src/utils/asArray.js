/**
 * @module utils
 */

/**
 * It is not always clear when d2 will return an array or a ModelCollection instance.
 * This function is used to work with both in the same way.
 * @param {Array|Object} input - Either an array of d2 model instances or a ModelCollection instance
 * @returns {Array} An array of model instances
 * @memberof module:utils
 * @function
 */
const asArray = input => {
    if (!input) {
        return [];
    }
    return typeof input.toArray === 'function' ? input.toArray() : input;
};

export default asArray;
