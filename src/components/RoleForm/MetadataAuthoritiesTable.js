import i18n from '@dhis2/d2-i18n'
import {
    Input,
    Checkbox,
    CheckboxField,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableBody,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    AuthorityPropType,
    MetadataAuthoritiesPropType,
} from './authority-prop-types'
import styles from './MetadataAuthoritiesTable.module.css'

const ColumnHeader = ({ children }) => (
    <DataTableColumnHeader fixed top="0">
        {children}
    </DataTableColumnHeader>
)

ColumnHeader.propTypes = {
    children: PropTypes.node.isRequired,
}

const CheckboxColumnHeader = ({
    name,
    label,
    selectedColumns,
    onSelectedColumnToggle,
}) => (
    <ColumnHeader>
        <CheckboxField
            dense
            name={name}
            label={label}
            checked={selectedColumns.has(name)}
            onChange={() => onSelectedColumnToggle(name)}
        />
    </ColumnHeader>
)

CheckboxColumnHeader.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selectedColumns: PropTypes.instanceOf(Set).isRequired,
    onSelectedColumnToggle: PropTypes.func.isRequired,
}

const AuthorityCell = ({ authority, disabled, selected, onToggle }) => (
    <DataTableCell>
        {!authority.empty && (
            <Checkbox
                dense
                disabled={authority.implicit || disabled}
                checked={authority.implicit || selected}
                onChange={onToggle}
            />
        )}
    </DataTableCell>
)

AuthorityCell.propTypes = {
    authority: AuthorityPropType.isRequired,
    selected: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

const MetadataAuthoritiesTable = ({
    metadataAuthorities,
    selectedAuthorities,
    onSelectedAuthorityToggle,
    selectedColumns,
    onSelectedColumnToggle,
    filter,
    onFilterChange,
    filterSelectedOnly,
    onFilterSelectedOnlyChange,
}) => (
    <div className={styles.container}>
        <div>
            <Input
                dense
                placeholder={i18n.t('Filter options')}
                value={filter}
                onChange={({ value }) => onFilterChange(value)}
            />
            <CheckboxField
                dense
                label={i18n.t('Only show selected metadata authorities')}
                checked={filterSelectedOnly}
                onChange={({ value }) => onFilterSelectedOnlyChange(value)}
            />
        </div>
        <DataTable scrollHeight="375px">
            <DataTableHead>
                <DataTableRow>
                    <ColumnHeader>{i18n.t('Authority')}</ColumnHeader>
                    <CheckboxColumnHeader
                        name="addUpdatePublic"
                        label={i18n.t('Add/Update Public')}
                        selectedColumns={selectedColumns}
                        onSelectedColumnToggle={onSelectedColumnToggle}
                    />
                    <CheckboxColumnHeader
                        name="addUpdatePrivate"
                        label={i18n.t('Add/Update Private')}
                        selectedColumns={selectedColumns}
                        onSelectedColumnToggle={onSelectedColumnToggle}
                    />
                    <CheckboxColumnHeader
                        name="delete"
                        label={i18n.t('Delete')}
                        selectedColumns={selectedColumns}
                        onSelectedColumnToggle={onSelectedColumnToggle}
                    />
                    <CheckboxColumnHeader
                        name="externalAccess"
                        label={i18n.t('External access')}
                        selectedColumns={selectedColumns}
                        onSelectedColumnToggle={onSelectedColumnToggle}
                    />
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                {metadataAuthorities.map(item => (
                    <DataTableRow key={item.name}>
                        <DataTableCell>{item.name}</DataTableCell>
                        <AuthorityCell
                            authority={item.addUpdatePublic}
                            selected={selectedAuthorities.has(
                                item.addUpdatePublic.id
                            )}
                            onToggle={() =>
                                onSelectedAuthorityToggle(
                                    item.addUpdatePublic.id
                                )
                            }
                        />
                        <AuthorityCell
                            authority={item.addUpdatePrivate}
                            disabled={selectedAuthorities.has(
                                item.addUpdatePublic.id
                            )}
                            selected={
                                selectedAuthorities.has(
                                    item.addUpdatePublic.id
                                ) ||
                                selectedAuthorities.has(
                                    item.addUpdatePrivate.id
                                )
                            }
                            onToggle={() =>
                                onSelectedAuthorityToggle(
                                    item.addUpdatePrivate.id
                                )
                            }
                        />
                        <AuthorityCell
                            authority={item.delete}
                            selected={selectedAuthorities.has(item.delete.id)}
                            onToggle={() =>
                                onSelectedAuthorityToggle(item.delete.id)
                            }
                        />
                        <AuthorityCell
                            authority={item.externalAccess}
                            selected={selectedAuthorities.has(
                                item.externalAccess.id
                            )}
                            onToggle={() =>
                                onSelectedAuthorityToggle(
                                    item.externalAccess.id
                                )
                            }
                        />
                    </DataTableRow>
                ))}
            </DataTableBody>
        </DataTable>
    </div>
)

MetadataAuthoritiesTable.propTypes = {
    filter: PropTypes.string.isRequired,
    filterSelectedOnly: PropTypes.bool.isRequired,
    metadataAuthorities: MetadataAuthoritiesPropType.isRequired,
    selectedAuthorities: PropTypes.instanceOf(Set).isRequired,
    selectedColumns: PropTypes.instanceOf(Set).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onFilterSelectedOnlyChange: PropTypes.func.isRequired,
    onSelectedAuthorityToggle: PropTypes.func.isRequired,
    onSelectedColumnToggle: PropTypes.func.isRequired,
}

export default MetadataAuthoritiesTable
