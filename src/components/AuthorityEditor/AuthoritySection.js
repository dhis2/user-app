import i18n from '@dhis2/d2-i18n'
import { Heading } from '@dhis2/d2-ui-core'
import { Paper, CircularProgress, Checkbox } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AuthorityGroup from './AuthorityGroup'
import AuthorityItem from './AuthorityItem'

/**
 * Renders a logical authority section. Within the section it can either render rows with `AuthorityGroups` for metadata,
 */
class AuthoritySection extends Component {
    itemsForMetadataHeader = header => {
        if (this.props.authSection.items === null) {
            return []
        }

        const headerIndex = this.props.authSection.headers.indexOf(header)
        return this.props.authSection.items
            .map(({ items }) => items[headerIndex - 1])
            .filter(item => !item.empty)
    }

    onTableHeadCheck = ({ header, value }) => {
        const ids =
            this.props.authSection.id === 'METADATA'
                ? this.itemsForMetadataHeader(header).map(item => item.id)
                : this.props.authSection.items.map(({ id }) => id)
        this.context.onAuthChange(ids, value)
    }

    renderAuthRow = (authSubject, index) => {
        const { shouldSelect, onAuthChange } = this.context
        return (
            <tr key={`row-${index}`}>
                {authSubject.items ? (
                    <AuthorityGroup
                        items={authSubject.items}
                        name={authSubject.name}
                    />
                ) : (
                    <AuthorityItem
                        authSubject={authSubject}
                        withLabel={true}
                        selected={shouldSelect(authSubject.id)}
                        onCheckedCallBack={onAuthChange}
                    />
                )}
            </tr>
        )
    }

    renderLoaderRow() {
        return (
            <tr>
                <td className="authority-editor__placeholder-cell">
                    <CircularProgress size={24} />
                </td>
            </tr>
        )
    }

    renderInfoRow(errorMsg) {
        let className = 'authority-editor__placeholder-cell'
        let msg = i18n.t('No matches found')

        if (errorMsg) {
            className += '--error'
            msg = errorMsg
        }

        return (
            <tr>
                <td className={className}>{msg}</td>
            </tr>
        )
    }

    renderContent(authSection) {
        if (!authSection.items) {
            return this.renderLoaderRow()
        }

        if (typeof authSection.items === 'string') {
            return this.renderInfoRow(authSection.items)
        }

        if (authSection.items.length === 0) {
            return this.renderInfoRow()
        }

        return authSection.items.map(this.renderAuthRow)
    }

    renderTableHead({ id, headers, items }) {
        const allItemsSelected = items =>
            Array.isArray(items) &&
            items.length > 0 &&
            items.every(({ id }) => this.context.shouldSelect(id))

        return (
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={`header-${index}`}>
                            {(id === 'METADATA' && index !== 0) ||
                            (id !== 'METADATA' && index === 0) ? (
                                <Checkbox
                                    className="authority-editor__auth-checkbox"
                                    label={header}
                                    onCheck={(_event, value) =>
                                        this.onTableHeadCheck({ header, value })
                                    }
                                    checked={
                                        id === 'METADATA'
                                            ? allItemsSelected(
                                                  this.itemsForMetadataHeader(
                                                      header
                                                  )
                                              )
                                            : allItemsSelected(items)
                                    }
                                />
                            ) : (
                                header
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
        )
    }

    render() {
        const { sectionKey, authSection } = this.props
        let wrapperClassName = `authority-editor__auth-group ${sectionKey}`
        if (authSection.items && authSection.items.length > 11) {
            wrapperClassName += ' scrollable'
        }

        let tableClassName = 'authority-editor__auth-group-table'
        tableClassName += ` columns-${authSection.headers.length}`

        return (
            <Paper className={wrapperClassName}>
                <Heading
                    level={6}
                    className="authority-editor__auth-group-header"
                >
                    {authSection.name}
                </Heading>
                <table className={tableClassName}>
                    {this.renderTableHead(authSection)}
                    <tbody>{this.renderContent(authSection)}</tbody>
                </table>
            </Paper>
        )
    }
}

AuthoritySection.propTypes = {
    authSection: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
}

AuthoritySection.contextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
}

export default AuthoritySection
