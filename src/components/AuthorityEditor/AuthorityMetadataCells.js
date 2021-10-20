import { DataTableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { AuthorityCell } from './AuthorityCell'
import { HighlightableText } from './HighlightableText'

const AuthorityMetadataCells = ({ name, items, onChange, searchChunks }) => (
    <>
        <DataTableCell>
            <HighlightableText text={name} searchChunks={searchChunks} />
        </DataTableCell>
        {items.map((item, index) => (
            <AuthorityCell
                key={item.id || index}
                empty={item.empty}
                id={item.id}
                implicitlySelected={item.implicitlySelected}
                name={item.name}
                searchChunks={searchChunks}
                selected={item.selected}
                onChange={onChange}
            />
        ))}
    </>
)

AuthorityMetadataCells.propTypes = {
    items: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    searchChunks: PropTypes.arrayOf(PropTypes.string),
}

export { AuthorityMetadataCells }
