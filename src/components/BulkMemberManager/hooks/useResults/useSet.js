import { useState, useMemo } from 'react'

export const useSet = () => {
    const [set, setSet] = useState(new Set())

    return useMemo(
        () => ({
            has: (value) => set.has(value),
            add: (value) => {
                setSet((set) => {
                    const newSet = new Set(set)
                    newSet.add(value)
                    return newSet
                })
            },
            delete: (value) => {
                setSet((set) => {
                    const newSet = new Set(set)
                    newSet.delete(value)
                    return newSet
                })
            },
            clear: () => setSet(new Set()),
            size: set.size,
        }),
        [set, setSet]
    )
}
