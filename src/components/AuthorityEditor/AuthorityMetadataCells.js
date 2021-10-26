import { DataTableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { AuthorityCell } from './AuthorityCell'
import { HighlightableText } from './HighlightableText'
import { METADATA } from './useAuthorities/constants'

const AuthorityMetadataCells = ({ name, items, searchChunks }) => (
    <>
        <DataTableCell>
            <HighlightableText text={name} searchChunks={searchChunks} />
        </DataTableCell>
        {items.map((item, index) => (
            <AuthorityCell
                key={item.id || index}
                empty={item.empty}
                sectionId={`${METADATA}_${index}`}
                id={item.id}
                name={item.name}
                implicit={item.implicit}
                searchChunks={searchChunks}
            />
        ))}
    </>
)

AuthorityMetadataCells.propTypes = {
    items: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    searchChunks: PropTypes.arrayOf(PropTypes.string),
}

const MemoizedAuthorityMetadataCells = memo(AuthorityMetadataCells)

export { MemoizedAuthorityMetadataCells as AuthorityMetadataCells }
