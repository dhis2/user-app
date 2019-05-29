import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'material-ui'
import HighlightableText from './HighlightableText'

/**
 * Renders a single authority cell. This can be an empty cell, or a checkbox with or without a label.
 * If label and searchChunks are present, the label text will be highlighted.
 * Depending on state this checkbox can be disabled or selected.
 */
class AuthorityItem extends Component {
    constructor(props) {
        super(props)
        this.state = { selected: props.selected }
    }

    onChecked = (_, value) => {
        const {
            authSubject: { id },
            onCheckedCallBack,
        } = this.props
        this.setState({ selected: value })
        onCheckedCallBack(id, value)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.selected !== this.state.selected) {
            this.setState({ selected: newProps.selected })
        }
    }

    render() {
        const { authSubject, withLabel, disabled } = this.props
        const { searchChunks } = this.context
        const { name, empty, implicit } = authSubject
        const baseClassName = 'authority-editor__auth-checkbox'
        const className = withLabel
            ? baseClassName
            : `${baseClassName}--without-label`
        const label = withLabel ? (
            <HighlightableText text={name} searchChunks={searchChunks} />
        ) : (
            ''
        )

        return (
            <td>
                {!empty ? (
                    <Checkbox
                        onCheck={this.onChecked}
                        label={label}
                        className={className}
                        checked={this.state.selected || Boolean(implicit)}
                        disabled={implicit || disabled}
                    />
                ) : (
                    <div className="authority-editor__empty-cell" />
                )}
            </td>
        )
    }
}

AuthorityItem.propTypes = {
    authSubject: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        empty: PropTypes.bool,
        implicit: PropTypes.bool,
    }).isRequired,
    withLabel: PropTypes.bool.isRequired,
    onCheckedCallBack: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
}

AuthorityItem.contextTypes = {
    searchChunks: PropTypes.array,
}

export default AuthorityItem
