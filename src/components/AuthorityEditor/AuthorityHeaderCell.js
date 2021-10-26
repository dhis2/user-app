import { CheckboxField, DataTableColumnHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useColumnSelectionState } from './useAuthorities/useColumnSelectionState'

const AuthorityHeaderCell = ({ header, disabled, sectionId }) => {
    const { selected, onChange } = useColumnSelectionState(sectionId)
    return (
        <DataTableColumnHeader fixed top="0">
            <CheckboxField
                dense
                label={header}
                onChange={onChange}
                checked={selected}
                disabled={disabled}
            />
        </DataTableColumnHeader>
    )
}

AuthorityHeaderCell.propTypes = {
    header: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
}

export { AuthorityHeaderCell }
