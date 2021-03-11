import endsWith from 'lodash.endswith'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AuthorityItem from './AuthorityItem'
import HighlightableText from './HighlightableText'
import { PUBLIC_ADD_SUFFIX, PRIVATE_ADD_SUFFIX } from './utils/groupAuthorities'

/**
 * A metadata authority group, which renders an array of 5 table cells.
 * The first cell contains the authority name and subsequent cells are authority-types corresponding to this name
 */
class AuthorityGroup extends Component {
    onAuthGroupChanged = (id, value) => {
        this.context.onAuthChange(id, value)

        if (this.isPublicAdd(id)) {
            // Force rerender on entire group when public add changes
            this.forceUpdate()
        }
    }

    isPublicAdd(id) {
        return endsWith(id, PUBLIC_ADD_SUFFIX)
    }

    isPrivateAdd(id) {
        return endsWith(id, PRIVATE_ADD_SUFFIX)
    }

    render() {
        const { name, items } = this.props
        const { shouldSelect, searchChunks } = this.context
        let publicAddSelected

        return items.reduce(
            (authGroup, authSubject, index) => {
                const isPublicAdd = this.isPublicAdd(authSubject.id)
                const isPrivateAdd = this.isPrivateAdd(authSubject.id)
                const implicitSelect = Boolean(
                    publicAddSelected && isPrivateAdd
                )
                const selected = shouldSelect(authSubject.id) || implicitSelect

                if (isPublicAdd) {
                    publicAddSelected = selected
                }

                authGroup.push(
                    <AuthorityItem
                        key={`authitem-${index}`}
                        authSubject={authSubject}
                        withLabel={false}
                        selected={selected}
                        disabled={implicitSelect}
                        onCheckedCallBack={this.onAuthGroupChanged}
                    />
                )
                return authGroup
            },
            [
                <td key={'group-label'}>
                    <HighlightableText
                        text={name}
                        searchChunks={searchChunks}
                    />
                </td>,
            ]
        )
    }
}

AuthorityGroup.propTypes = {
    items: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
}

AuthorityGroup.contextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
    searchChunks: PropTypes.array,
}

export default AuthorityGroup
