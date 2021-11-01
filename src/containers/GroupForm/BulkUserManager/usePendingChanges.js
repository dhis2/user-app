import { useState } from 'react'

export const usePendingChanges = () => {
    const [pendingChanges, setPendingChanges] = useState([])

    return {
        size: pendingChanges.length,
        map: fn => pendingChanges.map(fn),
        get: userId => pendingChanges.find(change => change.userId === userId),
        add: user => {
            setPendingChanges([
                ...pendingChanges,
                {
                    action: 'ADD',
                    userId: user.id,
                    username: user.username,
                },
            ])
        },
        remove: user => {
            setPendingChanges([
                ...pendingChanges,
                {
                    action: 'REMOVE',
                    userId: user.id,
                    username: user.username,
                },
            ])
        },
        cancel: pendingChange => {
            setPendingChanges(
                pendingChanges.filter(c => c.userId !== pendingChange.userId)
            )
        },
        cancelAll: () => setPendingChanges([]),
    }
}
