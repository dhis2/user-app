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
    onChecked = ({ checked }) => {
        const {
            authSubject: { id },
            onCheckedCallBack,
        } = this.props
        onCheckedCallBack([id], checked)
    }

    render() {
        const { authSubject, withLabel, disabled } = this.props
        const { searchChunks } = this.context
        const { name, empty, implicit } = authSubject
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
                        onCheck={this.onChecked}
                        label={label}
                        checked={this.props.selected || Boolean(implicit)}
                        disabled={implicit || disabled}
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
        implicit: PropTypes.bool,
        name: PropTypes.string,
    }).isRequired,
    selected: PropTypes.bool.isRequired,
    withLabel: PropTypes.bool.isRequired,
    onCheckedCallBack: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

AuthorityItem.contextTypes = {
    searchChunks: PropTypes.array,
}

export default AuthorityItem
