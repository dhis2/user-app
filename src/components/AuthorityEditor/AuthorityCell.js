import { CheckboxField, DataTableCell } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './AuthorityCell.module.css'
import { HighlightableText } from './HighlightableText'

const AuthorityCell = ({
    empty,
    id,
    implicitlySelected,
    label,
    name,
    searchChunks,
    selected,
    onChange,
}) => (
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
                checked={selected}
                disabled={implicitlySelected}
                value={id}
                className={cx({ [styles.centered]: !label })}
            />
        )}
    </DataTableCell>
)

AuthorityCell.propTypes = {
    empty: PropTypes.bool,
    id: PropTypes.string,
    implicitlySelected: PropTypes.bool,
    label: PropTypes.bool,
    name: PropTypes.string,
    searchChunks: PropTypes.arrayOf(PropTypes.string),
    selected: PropTypes.bool,
    onChange: PropTypes.func,
}

export { AuthorityCell }
