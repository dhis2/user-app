import { createContext, useContext, useState } from 'react'

const defaultFn = () => {
    throw new Error('Authority Selection Context has not been initialized')
}

const AuthoritySelectionContext = createContext({
    registerStateSetters: defaultFn,
    updateAuthority: defaultFn,
    updateAuthorities: defaultFn,
    isSelected: defaultFn,
    isImplicitlySelected: defaultFn,
    areAllSelected: defaultFn,
    populate: defaultFn,
    isEmpty: defaultFn,
})

const useSelectionContext = () => useContext(AuthoritySelectionContext)

const useSelectionState = id => {
    const {
        isSelected,
        isImplicitlySelected,
        registerStateSetters,
        updateAuthority,
    } = useSelectionContext()
    const [selected, setSelected] = useState(isSelected(id))
    const [implicitlySelected, setImplicitlySelected] = useState(
        isImplicitlySelected(id)
    )
    const onChange = ({ checked }) => updateAuthority(id, checked)

    registerStateSetters(id, setSelected, setImplicitlySelected)

    return { selected, implicitlySelected, onChange }
}

export { AuthoritySelectionContext, useSelectionContext, useSelectionState }
