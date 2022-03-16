import { useState } from 'react'

export const useMap = () => {
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
