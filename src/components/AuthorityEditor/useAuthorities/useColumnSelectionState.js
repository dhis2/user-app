import { useState } from 'react'
import { useSelectionContext } from './AuthoritySelectionContext'

const useColumnSelectionState = columnId => {
    const {
        isColumnSelected,
        toggleColumnHeader,
        registerColumnHeaderStateSetters,
    } = useSelectionContext()
    const [selected, setSelected] = useState(isColumnSelected(columnId))

    const onChange = ({ checked: selected }) =>
        toggleColumnHeader(columnId, selected)

    registerColumnHeaderStateSetters(columnId, setSelected)

    return { selected, onChange }
}

export { useColumnSelectionState }
