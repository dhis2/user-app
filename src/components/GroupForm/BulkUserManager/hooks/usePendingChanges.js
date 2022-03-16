import { useMap } from './useMap'

export const usePendingChanges = () => {
    const pendingChanges = useMap()

    return {
        size: pendingChanges.size,
        map: fn => Array.from(pendingChanges.values()).map(fn),
        get: userId => pendingChanges.get(userId),
        add: user => {
            pendingChanges.set(user.id, {
                action: 'ADD',
                userId: user.id,
                username: user.username,
            })
        },
        remove: user => {
            pendingChanges.set(user.id, {
                action: 'REMOVE',
                userId: user.id,
                username: user.username,
            })
        },
        cancel: pendingChange => {
            pendingChanges.delete(pendingChange.userId)
        },
        cancelAll: pendingChanges.clear,
    }
}
