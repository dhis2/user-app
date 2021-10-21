import { CheckboxField, DataTableCell } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './AuthorityCell.module.css'
import { HighlightableText } from './HighlightableText'
import { useSelectionState } from './useAuthorities/AuthoritySelectionContext'

const AuthorityCell = ({ empty, id, label, name, implicit, searchChunks }) => {
    const { selected, implicitlySelected, onChange } = useSelectionState(id)

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
}

export { AuthorityCell }
