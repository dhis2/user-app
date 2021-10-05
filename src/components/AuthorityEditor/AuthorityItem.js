import { CheckboxField, DataTableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import HighlightableText from './HighlightableText'

/**
 * Renders a single authority cell. This can be an empty cell, or a checkbox with or without a label.
 * If label and searchChunks are present, the label text will be highlighted.
 * Depending on state this checkbox can be disabled or selected.
 */
class AuthorityItem extends Component {
    handleChecked = ({ checked }) => {
        const {
            authSubject: { id },
            onCheckedCallBack,
        } = this.props
        onCheckedCallBack([id], checked)
    }

    render() {
        const { authSubject, withLabel } = this.props
        const { searchChunks } = this.context
        const { name, empty, selected, implicitlySelected } = authSubject
        const label = withLabel ? (
            <HighlightableText text={name} searchChunks={searchChunks} />
        ) : (
            ''
        )

        return (
            <DataTableCell>
                {!empty && (
                    <CheckboxField
                        dense
                        onChange={this.handleChecked}
                        label={label}
                        checked={selected}
                        disabled={implicitlySelected}
                    />
                )}
            </DataTableCell>
        )
    }
}

AuthorityItem.propTypes = {
    authSubject: PropTypes.shape({
        empty: PropTypes.bool,
        id: PropTypes.string,
        implicitlySelected: PropTypes.bool,
        name: PropTypes.string,
        selected: PropTypes.bool,
    }).isRequired,
    withLabel: PropTypes.bool.isRequired,
    onCheckedCallBack: PropTypes.func.isRequired,
}

AuthorityItem.contextTypes = {
    searchChunks: PropTypes.array,
}

export default AuthorityItem
