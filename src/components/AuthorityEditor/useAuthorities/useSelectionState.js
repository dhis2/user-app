import { useState } from 'react'
import { useSelectionContext } from './AuthoritySelectionContext'

const useSelectionState = (authorityId, columnId) => {
    const {
        isSelected,
        isImplicitlySelected,
        registerStateSetters,
        toggleAuthority,
    } = useSelectionContext()
    const [selected, setSelected] = useState(isSelected(authorityId))
    const [implicitlySelected, setImplicitlySelected] = useState(
        isImplicitlySelected(authorityId)
    )
    const onChange = ({ checked: selected }) =>
        toggleAuthority({ authorityId, columnId, selected })

    registerStateSetters(authorityId, setSelected, setImplicitlySelected)

    return { selected, implicitlySelected, onChange }
}

export { useSelectionState }
