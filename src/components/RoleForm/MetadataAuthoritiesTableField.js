import { ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { MetadataAuthoritiesPropType } from './authority-prop-types.js'
import MetadataAuthoritiesTable from './MetadataAuthoritiesTable.js'

export const groupAuthorities = (metadataAuthorities) =>
    metadataAuthorities.reduce(
        (groupedAuthorities, auth) => {
            for (const group of Object.keys(groupedAuthorities)) {
                if (auth[group].id) {
                    groupedAuthorities[group].push(auth[group].id)
                }
            }
            return groupedAuthorities
        },
        {
            addUpdatePublic: [],
            addUpdatePrivate: [],
            delete: [],
            externalAccess: [],
        }
    )

export const getInitiallySelectedColumns = ({
    metadataAuthorities,
    selectedAuthorities,
}) => {
    const groupedAuthorities = groupAuthorities(metadataAuthorities)
    const initiallySelectedColumns = new Set()
    for (const [column, ids] of Object.entries(groupedAuthorities)) {
        if (ids.length > 0 && ids.every((id) => selectedAuthorities.has(id))) {
            initiallySelectedColumns.add(column)
        }
    }
    return initiallySelectedColumns
}

const MetadataAuthoritiesTableFF = ({
    input,
    // Don't pass meta to MetadataAuthoritiesTable component as it invalidates React.memo
    // eslint-disable-next-line no-unused-vars
    meta,
    setSelectedColumns,
    ...props
}) => {
    const handleSelectedAuthorityToggle = useCallback(
        (id) => {
            const groupedAuthorities = groupAuthorities(
                props.metadataAuthorities
            )
            const newSelectedAuthorities = new Set(input.value)
            const newSelectedColumns = new Set(props.selectedColumns)

            if (newSelectedAuthorities.has(id)) {
                newSelectedAuthorities.delete(id)
                for (const [group, ids] of Object.entries(groupedAuthorities)) {
                    if (ids.includes(id)) {
                        newSelectedColumns.delete(group)
                        break
                    }
                }
            } else {
                newSelectedAuthorities.add(id)
                for (const [group, ids] of Object.entries(groupedAuthorities)) {
                    if (
                        ids.includes(id) &&
                        ids.every((i) => newSelectedAuthorities.has(i))
                    ) {
                        newSelectedColumns.add(group)
                        break
                    }
                }
            }

            setSelectedColumns(newSelectedColumns)
            input.onChange(newSelectedAuthorities)
        },
        [
            input.value,
            input.onChange,
            props.metadataAuthorities,
            props.selectedColumns,
            setSelectedColumns,
        ]
    )

    const handleSelectedColumnToggle = useCallback(
        (column) => {
            const groupedAuthorities = groupAuthorities(
                props.metadataAuthorities
            )
            const newSelectedAuthorities = new Set(input.value)
            const newSelectedColumns = new Set(props.selectedColumns)

            if (newSelectedColumns.has(column)) {
                newSelectedColumns.delete(column)
                for (const id of groupedAuthorities[column]) {
                    newSelectedAuthorities.delete(id)
                }
            } else {
                newSelectedColumns.add(column)
                for (const id of groupedAuthorities[column]) {
                    newSelectedAuthorities.add(id)
                }
            }

            setSelectedColumns(newSelectedColumns)
            input.onChange(newSelectedAuthorities)
        },
        [
            input.value,
            input.onChange,
            props.metadataAuthorities,
            props.selectedColumns,
            setSelectedColumns,
        ]
    )

    return (
        <MetadataAuthoritiesTable
            {...props}
            selectedAuthorities={input.value}
            onSelectedAuthorityToggle={handleSelectedAuthorityToggle}
            onSelectedColumnToggle={handleSelectedColumnToggle}
        />
    )
}

MetadataAuthoritiesTableFF.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.instanceOf(Set).isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.object.isRequired,
    metadataAuthorities: MetadataAuthoritiesPropType.isRequired,
    selectedColumns: PropTypes.instanceOf(Set).isRequired,
    setSelectedColumns: PropTypes.func.isRequired,
}

const MetadataAuthoritiesTableField = ({
    initialValue,
    metadataAuthorities,
    ...props
}) => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState(new Set(initialValue))
    const [selectedColumns, setSelectedColumns] = useState(() =>
        getInitiallySelectedColumns({
            metadataAuthorities,
            selectedAuthorities: memoedInitialValue,
        })
    )
    const [filter, setFilter] = useState('')
    const [filterSelectedOnly, setFilterSelectedOnly] = useState(false)

    return (
        <ReactFinalForm.Field
            {...props}
            component={MetadataAuthoritiesTableFF}
            initialValue={memoedInitialValue}
            metadataAuthorities={metadataAuthorities}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            filter={filter}
            onFilterChange={setFilter}
            filterSelectedOnly={filterSelectedOnly}
            onFilterSelectedOnlyChange={setFilterSelectedOnly}
        />
    )
}

MetadataAuthoritiesTableField.propTypes = {
    initialValue: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    metadataAuthorities: MetadataAuthoritiesPropType.isRequired,
}

export default MetadataAuthoritiesTableField
