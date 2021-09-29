import i18n from '@dhis2/d2-i18n'
import { Heading } from '@dhis2/d2-ui-core'
import {
    Card,
    CircularLoader,
    CheckboxField,
    NoticeBox,
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
            <DataTableRow key={`row-${index}`}>
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
                <DataTableCell>
                    {errorMsg ? (
                        <NoticeBox error>{errorMsg}</NoticeBox>
                    ) : (
                        <NoticeBox>{i18n.t('No matches found')}</NoticeBox>
                    )}
                </DataTableCell>
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

    renderTableHead({ id, headers, items }) {
        const allItemsSelected = items =>
            Array.isArray(items) &&
            items.length > 0 &&
            items.every(({ id }) => this.context.shouldSelect(id))

        return (
            <DataTableHead>
                <DataTableRow>
                    {headers.map((header, index) => (
                        <DataTableColumnHeader
                            key={`header-${index}`}
                            fixed
                            top="0"
                        >
                            {(id === 'METADATA' && index !== 0) ||
                            (id !== 'METADATA' && index === 0) ? (
                                <CheckboxField
                                    dense
                                    label={header}
                                    onChange={({ checked }) =>
                                        this.onTableHeadCheck({
                                            header,
                                            value: checked,
                                        })
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
                        </DataTableColumnHeader>
                    ))}
                </DataTableRow>
            </DataTableHead>
        )
    }

    render() {
        const { authSection } = this.props

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
