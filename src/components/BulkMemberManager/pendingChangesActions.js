export const resetChanges = () => ({
    additions: [],
    removals: [],
})

export const addEntity = (pendingChanges, entity) => ({
    ...pendingChanges,
    additions: [...pendingChanges.additions, entity],
})

export const removeEntity = (pendingChanges, entity) => ({
    ...pendingChanges,
    removals: [...pendingChanges.removals, entity],
})

export const cancelAddEntity = (pendingChanges, entity) => ({
    ...pendingChanges,
    additions: pendingChanges.additions.filter((e) => e !== entity),
})

export const cancelRemoveEntity = (pendingChanges, entity) => ({
    ...pendingChanges,
    removals: pendingChanges.removals.filter((e) => e !== entity),
})

export const totalPendingChanges = (pendingChanges) =>
    pendingChanges.additions.length + pendingChanges.removals.length
