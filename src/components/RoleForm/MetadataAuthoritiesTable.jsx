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
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    AuthorityPropType,
    MetadataAuthoritiesPropType,
} from './authority-prop-types.js'
import styles from './MetadataAuthoritiesTable.module.css'

const ColumnHeader = ({ children }) => (
    <DataTableColumnHeader fixed top="0" className={styles.columnHeader}>
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

const AuthorityCell = React.memo(
    ({ authority, disabled, selected, onSelectedAuthorityToggle }) => (
        <DataTableCell>
            {!authority.empty && (
                <Checkbox
                    dense
                    disabled={authority.implicit || disabled}
                    checked={authority.implicit || selected}
                    onChange={() => onSelectedAuthorityToggle(authority.id)}
                />
            )}
        </DataTableCell>
    )
)

AuthorityCell.propTypes = {
    authority: AuthorityPropType.isRequired,
    selected: PropTypes.bool.isRequired,
    onSelectedAuthorityToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

const Row = ({
    item,
    filter,
    filterSelectedOnly,
    selectedAuthorities,
    onSelectedAuthorityToggle,
}) => {
    const addUpdatePublicSelected = selectedAuthorities.has(
        item.addUpdatePublic.id
    )
    const addUpdatePrivateSelected =
        addUpdatePublicSelected ||
        selectedAuthorities.has(item.addUpdatePrivate.id)
    const deleteSelected = selectedAuthorities.has(item.delete.id)
    const externalAccessSelected = selectedAuthorities.has(
        item.externalAccess.id
    )

    const hasSelection =
        addUpdatePublicSelected ||
        addUpdatePrivateSelected ||
        deleteSelected ||
        externalAccessSelected

    return (
        <DataTableRow
            className={cx({
                [styles.hiddenRow]: filterSelectedOnly
                    ? !hasSelection
                    : !item.name
                          .toLocaleLowerCase()
                          .includes(filter.toLocaleLowerCase()),
            })}
        >
            <DataTableCell>{item.name}</DataTableCell>
            <AuthorityCell
                authority={item.addUpdatePublic}
                selected={addUpdatePublicSelected}
                onSelectedAuthorityToggle={onSelectedAuthorityToggle}
            />
            <AuthorityCell
                authority={item.addUpdatePrivate}
                disabled={selectedAuthorities.has(item.addUpdatePublic.id)}
                selected={addUpdatePrivateSelected}
                onSelectedAuthorityToggle={onSelectedAuthorityToggle}
            />
            <AuthorityCell
                authority={item.delete}
                selected={deleteSelected}
                onSelectedAuthorityToggle={onSelectedAuthorityToggle}
            />
            <AuthorityCell
                authority={item.externalAccess}
                selected={externalAccessSelected}
                onSelectedAuthorityToggle={onSelectedAuthorityToggle}
            />
        </DataTableRow>
    )
}

Row.propTypes = {
    filter: PropTypes.string.isRequired,
    filterSelectedOnly: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    selectedAuthorities: PropTypes.instanceOf(Set).isRequired,
    onSelectedAuthorityToggle: PropTypes.func.isRequired,
}

const MetadataAuthoritiesTable = React.memo(
    ({
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
            <div className={styles.filters}>
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
                    onChange={({ checked }) =>
                        onFilterSelectedOnlyChange(checked)
                    }
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
                    {metadataAuthorities.map((item) => (
                        <Row
                            key={item.name}
                            item={item}
                            filter={filter}
                            filterSelectedOnly={filterSelectedOnly}
                            selectedAuthorities={selectedAuthorities}
                            onSelectedAuthorityToggle={
                                onSelectedAuthorityToggle
                            }
                        />
                    ))}
                </DataTableBody>
            </DataTable>
        </div>
    )
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
