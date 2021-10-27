import { DataTableColumnHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { AuthorityHeaderCell } from './AuthorityHeaderCell'
import { METADATA } from './useAuthorities/constants'

const AuthorityMetadataHeaderCells = ({ headers, disabled }) => {
    return headers.map((header, index) =>
        index === 0 ? (
            <DataTableColumnHeader fixed top="0" key={header}>
                {header}
            </DataTableColumnHeader>
        ) : (
            <AuthorityHeaderCell
                key={header}
                header={header}
                sectionId={`${METADATA}_${index - 1}`}
                disabled={disabled}
            />
        )
    )
}

AuthorityMetadataHeaderCells.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    disabled: PropTypes.bool,
}

export { AuthorityMetadataHeaderCells }
