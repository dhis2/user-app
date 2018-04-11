const getNestedProp = (propertyPathStr, parent) => {
    return propertyPathStr.split('.').reduce((currentLevel, propName) => {
        return currentLevel && currentLevel[propName]
            ? currentLevel[propName]
            : null;
    }, parent);
};

export default getNestedProp;
