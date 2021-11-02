import { useState } from 'react'

const useMap = () => {
    const [map, setMap] = useState(new Map())

    return {
        set: (key, value) => {
            setMap(map => {
                const newMap = new Map(map)
                newMap.set(key, value)
                return newMap
            })
        },
        get: (key, value) => map.get(key, value),
        delete: key => {
            setMap(map => {
                const newMap = new Map(map)
                newMap.delete(key)
                return newMap
            })
        },
        clear: () => setMap(new Map()),
        values: () => map.values(),
        size: map.size,
    }
}

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
