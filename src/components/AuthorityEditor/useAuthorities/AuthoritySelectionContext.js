import { createContext, useContext } from 'react'

const defaultFn = () => {
    throw new Error('Authority Selection Context has not been initialized')
}

const AuthoritySelectionContext = createContext({
    isEmpty: defaultFn,
    isImplicitlySelected: defaultFn,
    isSelected: defaultFn,
    isColumnSelected: defaultFn,
    populate: defaultFn,
    registerColumnHeaderStateSetters: defaultFn,
    registerStateSetters: defaultFn,
    toggleAuthority: defaultFn,
    toggleColumnHeader: defaultFn,
})

const useSelectionContext = () => useContext(AuthoritySelectionContext)

export { AuthoritySelectionContext, useSelectionContext }
