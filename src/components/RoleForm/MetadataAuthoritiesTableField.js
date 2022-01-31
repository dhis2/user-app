import { ReactFinalForm } from '@dhis2/ui'
import React, { useState } from 'react'
import MetadataAuthoritiesTable from './MetadataAuthoritiesTable.js'

const MetadataAuthoritiesTableFF = ({ input, ...props }) => {
    // TODO
    const handleChange = () => {
        const newValue = 'whatever'
        input.onChange(newValue)
    }

    return <MetadataAuthoritiesTable {...props} />
}

const MetadataAuthoritiesTableField = ({ initialValue, ...props }) => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState(initialValue)

    return (
        <ReactFinalForm.Field
            {...props}
            component={MetadataAuthoritiesTableFF}
            initialValue={memoedInitialValue}
            metadataAuthorities={metadataAuthorities}
            selectedAuthorities={selectedAuthorities}
            onSelectedAuthoritiesChange
            selectedHeaders
            onSelectedHeadersChange
            filter
            onFilterChange
            filterSelectedOnly
            onFilterSelectedOnlyChange
        />
    )
}

export default MetadataAuthoritiesTableField
