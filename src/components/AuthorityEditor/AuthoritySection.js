import i18n from '@dhis2/d2-i18n'
import { Heading } from '@dhis2/d2-ui-core'
import {
    Card,
    CircularLoader,
    CheckboxField,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableCell,
    DataTableBody,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AuthorityGroup from './AuthorityGroup'
import AuthorityItem from './AuthorityItem'
import styles from './AuthoritySection.module.css'
import { isPublicAdd, isPrivateAdd } from './utils/groupAuthorities'

/**
 * Renders a logical authority section. Within the section it can either render rows with `AuthorityGroups` for metadata,
 */
class AuthoritySection extends Component {
    itemsForMetadataHeader = (items, header) => {
        const headerIndex = this.props.authSection.headers.indexOf(header)
        if (items === null || headerIndex === 0) {
            return []
        }

        return items
            .map(({ items }) => items[headerIndex - 1])
            .filter(item => !item.empty)
    }

    onTableHeadCheck = ({ authSection, header, value }) => {
        const ids =
            authSection.id === 'METADATA'
                ? this.itemsForMetadataHeader(authSection.items, header).map(
                      item => item.id
                  )
                : authSection.items.map(({ id }) => id)
        this.onAuthChange(ids, value)
    }

    renderAuthRow = (authSubject, index) => {
        return (
            <DataTableRow key={`row-${index}`}>
                {authSubject.items ? (
                    <AuthorityGroup
                        items={authSubject.items}
                        name={authSubject.name}
                        onAuthChange={this.onAuthChange}
                    />
                ) : (
                    <AuthorityItem
                        authSubject={authSubject}
                        withLabel={true}
                        onCheckedCallBack={this.onAuthChange}
                    />
                )}
            </DataTableRow>
        )
    }

    renderLoaderRow() {
        return (
            <DataTableRow>
                <DataTableCell>
                    <CircularLoader small />
                </DataTableCell>
            </DataTableRow>
        )
    }

    renderInfoRow(errorMsg) {
        return (
            <DataTableRow>
                {errorMsg ? (
                    <DataTableCell error>{errorMsg}</DataTableCell>
                ) : (
                    <DataTableCell muted>
                        {i18n.t('No matches found')}
                    </DataTableCell>
                )}
            </DataTableRow>
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

    renderTableHead(authSection) {
        const isMetadata = authSection.id === 'METADATA'
        const allItemsSelected = items =>
            Array.isArray(items) &&
            items.length > 0 &&
            items.every(({ selected, empty }) => selected || empty)
        const allItemsImplicitlySelected = items =>
            allItemsSelected(items) &&
            items.every(
                ({ implicitlySelected, empty }) => implicitlySelected || empty
            )

        return (
            <DataTableHead>
                <DataTableRow>
                    {authSection.headers.map((header, index) => {
                        const items = isMetadata
                            ? this.itemsForMetadataHeader(
                                  authSection.items,
                                  header
                              )
                            : authSection.items

                        return (
                            <DataTableColumnHeader
                                key={`header-${index}`}
                                fixed
                                top="0"
                            >
                                {(isMetadata && index !== 0) ||
                                (!isMetadata && index === 0) ? (
                                    <CheckboxField
                                        dense
                                        label={header}
                                        onChange={({ checked }) =>
                                            this.onTableHeadCheck({
                                                authSection,
                                                header,
                                                value: checked,
                                            })
                                        }
                                        checked={allItemsSelected(items)}
                                        disabled={
                                            isMetadata &&
                                            allItemsImplicitlySelected(items)
                                        }
                                    />
                                ) : (
                                    header
                                )}
                            </DataTableColumnHeader>
                        )
                    })}
                </DataTableRow>
            </DataTableHead>
        )
    }

    onAuthChange = (ids, value) => {
        if (typeof ids === 'string') {
            ids = [ids]
        }

        this.context.onAuthChange(ids, value)

        if (ids.some(isPublicAdd)) {
            // Force rerender when a public add changes
            this.forceUpdate()
        }
    }

    itemsWithSelected = () => {
        const itemsWithSelected = authSection => {
            let publicAddSelected

            return authSection.items.map(authSubject => {
                const implicitlySelected =
                    (publicAddSelected && isPrivateAdd(authSubject.id)) ||
                    authSubject.implicit
                const selected =
                    this.context.shouldSelect(authSubject.id) ||
                    implicitlySelected

                if (isPublicAdd(authSubject.id)) {
                    publicAddSelected = selected
                }

                return {
                    ...authSubject,
                    items: authSubject.items && itemsWithSelected(authSubject),
                    selected,
                    implicitlySelected,
                }
            })
        }

        if (Array.isArray(this.props.authSection.items)) {
            return itemsWithSelected(this.props.authSection)
        }
        return this.props.authSection.items
    }

    render() {
        const items = this.itemsWithSelected()
        const authSection = {
            ...this.props.authSection,
            items,
        }

        return (
            <Card
                className={
                    authSection.id === 'METADATA'
                        ? styles.metadata
                        : styles.section
                }
            >
                <Heading
                    level={6}
                    className="authority-editor__auth-group-header"
                >
                    {authSection.name}
                </Heading>
                <DataTable scrollHeight="375px">
                    {this.renderTableHead(authSection)}
                    <DataTableBody>
                        {this.renderContent(authSection)}
                    </DataTableBody>
                </DataTable>
            </Card>
        )
    }
}

AuthoritySection.propTypes = {
    authSection: PropTypes.object.isRequired,
}

AuthoritySection.contextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
}

export default AuthoritySection
