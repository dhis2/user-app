import { CheckboxField, DataTableColumnHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelectionContext } from './useAuthorities/AuthoritySelectionContext'

const AuthorityHeaderCell = ({ header, items, disabled }) => {
    const { areAllSelected, updateAuthorities } = useSelectionContext()
    const authorityIds = items.map(({ id }) => id)
    const [checked, setChecked] = useState(areAllSelected(authorityIds))
    const toggleAll = ({ checked }) => {
        updateAuthorities(authorityIds, checked)
        setChecked(checked)
    }

    useEffect(() => {
        setChecked(areAllSelected(items.map(({ id }) => id)))
    }, [items])

    return (
        <DataTableColumnHeader fixed top="0">
            <CheckboxField
                dense
                label={header}
                onChange={toggleAll}
                checked={checked}
                disabled={disabled}
            />
        </DataTableColumnHeader>
    )
}

AuthorityHeaderCell.propTypes = {
    header: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
}

export { AuthorityHeaderCell }
