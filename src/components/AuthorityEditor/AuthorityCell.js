import { CheckboxField, DataTableCell } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import styles from './AuthorityCell.module.css'
import { HighlightableText } from './HighlightableText'
import { useSelectionState } from './useAuthorities/useSelectionState'

const AuthorityCell = ({
    empty,
    id,
    implicit,
    label,
    name,
    searchChunks,
    sectionId,
}) => {
    const { selected, implicitlySelected, onChange } = useSelectionState(
        id,
        sectionId
    )

    return (
        <DataTableCell>
            {!empty && (
                <CheckboxField
                    dense
                    onChange={onChange}
                    label={
                        label && (
                            <HighlightableText
                                text={name}
                                searchChunks={searchChunks}
                            />
                        )
                    }
                    checked={selected || implicitlySelected || implicit}
                    disabled={implicitlySelected || implicit}
                    value={id}
                    className={cx({ [styles.centered]: !label })}
                />
            )}
        </DataTableCell>
    )
}

AuthorityCell.propTypes = {
    empty: PropTypes.bool,
    id: PropTypes.string,
    implicit: PropTypes.bool,
    label: PropTypes.bool,
    name: PropTypes.string,
    searchChunks: PropTypes.arrayOf(PropTypes.string),
    sectionId: PropTypes.string,
}

const MemoizedAuthorityCell = memo(AuthorityCell)

export { MemoizedAuthorityCell as AuthorityCell }
