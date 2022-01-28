import React from 'react'
import PropTypes from 'prop-types'
import {
    Input,
    CheckboxField,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
    DataTableBody,
    DataTableCell
} from '@dhis2/ui'

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
    selectedHeaders,
    onSelectedHeadersChange
}) => (
    <ColumnHeader>
        <CheckboxField
            dense
            name={name}
            label={label}
            checked={selectedHeaders.has(name)}
            onChange={onSelectedHeadersChange}
        />
    </ColumnHeader>
)

// TODO: look into using React.memo
const MetadataAuthoritiesTable = ({ metadataAuthorities, selectedAuthorities, onSelectedAuthoritiesChange, selectedHeaders, onSelectedHeadersChange, filter, onFilterChange, filterSelectedOnly, onFilterSelectedOnlyChange }) => {
    return (
        <>
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
                    value={filterSelectedOnly}
                    onChange={({ value }) => onFilterSelectedOnlyChange(value)}
                />
            </div>
            <DataTable scrollHeight="375px">
                <DataTableHead>
                    <DataTableRow>
                        <ColumnHeader>
                            {i18n.t('Authority')}
                        </ColumnHeader>
                        <CheckboxColumnHeader
                            name="addUpdatePublic"
                            label={i18n.t('Add/Update Public')}
                            selectedHeaders={selectedHeaders}
                            onSelectedHeadersChange={onSelectedHeadersChange}
                        />
                        <CheckboxColumnHeader
                            name="addUpdatePrivate"
                            label={i18n.t('Add/Update Private')}
                            selectedHeaders={selectedHeaders}
                            onSelectedHeadersChange={onSelectedHeadersChange}
                        />
                        <CheckboxColumnHeader
                            name="delete"
                            label={i18n.t('Delete')}
                            selectedHeaders={selectedHeaders}
                            onSelectedHeadersChange={onSelectedHeadersChange}
                        />
                        <CheckboxColumnHeader
                            name="externalAccess"
                            label={i18n.t('External access')}
                            selectedHeaders={selectedHeaders}
                            onSelectedHeadersChange={onSelectedHeadersChange}
                        />
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {metadataAuthorities.items.map(item => (
                        <DataTableRow key={item.id}>
                            <AuthorityMetadataCells
                                items={item.items}
                                name={item.name}
                                searchChunks={searchChunks}
                            />
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </>
    )
}

MetadataAuthoritiesTable.propTypes = {
    // TODO: use PropTypes.shape instead of PropTypes.object
    metadataAuthorities: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    filterSelectedOnly: PropTypes.bool.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onFilterSelectedOnlyChange: PropTypes.func.isRequired,
}

export default MetadataAuthoritiesTable
