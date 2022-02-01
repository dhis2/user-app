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
        id: role?.id,
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
