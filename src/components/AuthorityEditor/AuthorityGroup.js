import { DataTableCell } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AuthorityItem from './AuthorityItem'
import HighlightableText from './HighlightableText'

/**
 * A metadata authority group, which renders an array of 5 table cells.
 * The first cell contains the authority name and subsequent cells are authority-types corresponding to this name
 */
class AuthorityGroup extends Component {
    render() {
        const { name, items, onAuthChange } = this.props
        const { searchChunks } = this.context

        return [
            <DataTableCell key="group-label">
                <HighlightableText text={name} searchChunks={searchChunks} />
            </DataTableCell>,
            ...items.map((authSubject, index) => (
                <AuthorityItem
                    key={`authitem-${index}`}
                    authSubject={authSubject}
                    withLabel={false}
                    onCheckedCallBack={onAuthChange}
                />
            )),
        ]
    }
}

AuthorityGroup.propTypes = {
    items: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    onAuthChange: PropTypes.func.isRequired,
}

AuthorityGroup.contextTypes = {
    searchChunks: PropTypes.array,
}

export default AuthorityGroup
