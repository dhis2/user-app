import { CheckboxField, DataTableColumnHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelectionContext } from './useAuthorities/AuthoritySelectionContext'

const AuthorityMetadataHeaderCells = ({ items, headers, disabled }) => {
    const { isSelected, isImplicitlySelected, updateAuthorities } =
        useSelectionContext()
    const computeColumnsState = () =>
        headers.slice(1).reduce(
            (acc, _, columnIndex) => {
                const selected = items.every(item => {
                    const authority = item.items[columnIndex]
                    return (
                        isSelected(authority.id) ||
                        isImplicitlySelected(authority.id) ||
                        authority.empty
                    )
                })
                const empty = items.every(item => item.items[columnIndex].empty)
                acc.push({
                    checked: selected && !empty,
                    disabled: disabled || empty,
                })
                return acc
            },
            // Include empty item to avoid index mismathes
            [null]
        )
    const [columnsState, setColumnsState] = useState(computeColumnsState())
    const toggleColumn = ({ checked, value }) => {
        const columnIndex = parseInt(value) - 1
        const authorityIdsInColumn = items.map(
            item => item.items[columnIndex].id
        )
        updateAuthorities(authorityIdsInColumn, checked)
        setColumnsState(computeColumnsState())
    }

    useEffect(() => {
        setColumnsState(computeColumnsState())
    }, [items])

    return headers.map((header, index) => (
        <DataTableColumnHeader fixed top="0" key={header}>
            {index === 0 ? (
                header
            ) : (
                <CheckboxField
                    dense
                    label={header}
                    onChange={toggleColumn}
                    checked={columnsState[index].checked}
                    disabled={columnsState[index].disabled}
                    value={String(index)}
                />
            )}
        </DataTableColumnHeader>
    ))
}

AuthorityMetadataHeaderCells.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
}

export { AuthorityMetadataHeaderCells }
