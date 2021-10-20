import { CheckboxField, DataTableColumnHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const AuthorityHeaderCell = ({
    header,
    items,
    selected,
    setSelected,
    disabled,
}) => {
    const allSelected = items.every(({ selected }) => selected)
    const toggleAll = ({ checked }) => {
        if (checked) {
            const selectedWithItems = Array.from(
                new Set([...selected, ...items.map(({ id }) => id)])
            )
            setSelected(selectedWithItems)
        } else {
            const itemSet = new Set(items.map(({ id }) => id))
            const selectedWithoutItems = selected.filter(
                authId => !itemSet.has(authId)
            )
            setSelected(selectedWithoutItems)
        }
    }

    return (
        <DataTableColumnHeader fixed top="0">
            <CheckboxField
                dense
                label={header}
                onChange={toggleAll}
                checked={allSelected && !disabled}
                disabled={disabled}
            />
        </DataTableColumnHeader>
    )
}

AuthorityHeaderCell.propTypes = {
    header: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export { AuthorityHeaderCell }
