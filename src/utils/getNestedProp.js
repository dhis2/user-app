/**
 * Helper function for form components (UserForm, GroupForm, RoleForm).
 * This function can receive a string representation of a property path, i.e. 'userCredentials.username'
 * and an object to pick from and will return the nested property's value.
 * This works recursively so it can be as many levels deep as required.
 * @param {String} propertyPathStr - String representation of a property path
 * @param {*} parent - The base object to pick from
 * @returns {*} The value of the nested property
 * @memberof module:utils
 * @function
 */
const getNestedProp = (propertyPathStr, parent) => {
    return propertyPathStr.split('.').reduce((currentLevel, propName) => {
        return currentLevel && currentLevel[propName]
            ? currentLevel[propName]
            : null
    }, parent)
}

export default getNestedProp
