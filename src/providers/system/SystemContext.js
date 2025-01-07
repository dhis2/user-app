import React from 'react'

export const SystemContext = React.createContext({
    authorities: [],
    authorityIdToNameMap: new Map(),
    usersCanAssignOwnUserRoles: false,
})
