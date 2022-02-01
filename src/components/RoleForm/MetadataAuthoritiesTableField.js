import { ReactFinalForm } from '@dhis2/ui'
import React, { useState } from 'react'
import MetadataAuthoritiesTable from './MetadataAuthoritiesTable'

const MetadataAuthoritiesTableFF = ({ input, ...props }) => {
    // TODO
    const handleChange = () => {
        const newValue = 'whatever'
        input.onChange(newValue)
    }

    return <MetadataAuthoritiesTable {...props} />
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
    const [selectedAuthorities, setSelectedAuthorities] =
        useState(memoedInitialValue)
    // TODO: if all auths in a column are selected, then set column as selected in initial state
    const [selectedColumns, setSelectedColumns] = useState(new Set())
    const [filter, setFilter] = useState('')
    const [filterSelectedOnly, setFilterSelectedOnly] = useState(false)

    const handleSelectedAuthorityToggle = id => {
        // TODO: call onChange(newSelectedAuthorities)
        // TODO: call setSelectedColumns(selectedColumns)

        const newSelectedAuthorities = new Set(selectedAuthorities)
        if (newSelectedAuthorities.has(id)) {
            newSelectedAuthorities.delete(id)
        } else {
            newSelectedAuthorities.add(id)
        }
        setSelectedAuthorities(newSelectedAuthorities)
    }

    const handleSelectedColumnToggle = column => {
        // TODO: call onChange(newSelectedAuthorities)
    }

    return (
        <ReactFinalForm.Field
            {...props}
            component={MetadataAuthoritiesTableFF}
            initialValue={memoedInitialValue}
            metadataAuthorities={metadataAuthorities}
            selectedAuthorities={selectedAuthorities}
            onSelectedAuthorityToggle={handleSelectedAuthorityToggle}
            selectedColumns={selectedColumns}
            onSelectedColumnToggle={handleSelectedColumnToggle}
            filter={filter}
            onFilterChange={setFilter}
            filterSelectedOnly={filterSelectedOnly}
            onFilterSelectedOnlyChange={setFilterSelectedOnly}
        />
    )
}

export default MetadataAuthoritiesTableField
