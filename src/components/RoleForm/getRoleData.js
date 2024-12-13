export const getRoleData = ({ values }) => {
    const {
        name,
        description,
        metadataAuthorities,
        appAuthorities,
        trackerAuthorities,
        importExportAuthorities,
        systemAuthorities,
        legacyAuthorities,
    } = values

    return {
        name,
        description,
        authorities: [
            ...metadataAuthorities,
            ...appAuthorities,
            ...trackerAuthorities,
            ...importExportAuthorities,
            ...systemAuthorities,
            ...(legacyAuthorities ?? []),
        ],
    }
}
