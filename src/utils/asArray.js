const asArray = object => {
    if (!object) {
        return [];
    }
    return typeof object.toArray === 'function' ? object.toArray() : object;
};

export default asArray;
