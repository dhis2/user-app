export const getRoleData = ({ values, role }) => {
    const {
        name,
        description,
        metadataAuthorities,
        appAuthorities,
        trackerAuthorities,
        importExportAuthorities,
        systemAuthorities,
    } = values

    return {
        // Because the data object is used as the payload of a PUT request,
        // properties that are omitted will be removed. To prevent this, all
        // remaining owned properties are copied from the user to the data
        // object.
        ...role,

        name,
        description,
        authorities: [
            ...metadataAuthorities,
            ...appAuthorities,
            ...trackerAuthorities,
            ...importExportAuthorities,
            ...systemAuthorities,
        ],
    }
}
