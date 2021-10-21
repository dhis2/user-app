import {
    DataTableToolbar,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableBody,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { AuthorityCell } from './AuthorityCell'
import { AuthorityHeaderCell } from './AuthorityHeaderCell'
import { AuthorityMetadataCells } from './AuthorityMetadataCells'
import { AuthorityMetadataHeaderCells } from './AuthorityMetadataHeaderCells'
import styles from './AuthorityTable.module.css'
import { AuthorityTableBodyMask } from './AuthorityTableBodyMask'

const AuthorityTable = ({
    headers,
    items,
    name,
    error,
    loading,
    metadata,
    searchChunks,
}) => (
    <div
        className={cx(styles.tableContainer, {
            [styles.metadata]: metadata,
        })}
    >
        <DataTableToolbar>
            <h2 className={styles.toolbarHeader}>{name}</h2>
        </DataTableToolbar>
        <DataTable scrollHeight="375px">
            <DataTableHead>
                <DataTableRow>
                    {metadata ? (
                        <AuthorityMetadataHeaderCells
                            items={items}
                            headers={headers}
                            disabled={items.length === 0 || loading}
                        />
                    ) : (
                        <AuthorityHeaderCell
                            items={items}
                            header={headers[0]}
                            disabled={items.length === 0 || loading}
                        />
                    )}
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                <AuthorityTableBodyMask
                    loading={loading}
                    error={error}
                    noMatches={items.length === 0}
                >
                    {items.map((item, index) => (
                        <DataTableRow key={item.id || index}>
                            {metadata ? (
                                <AuthorityMetadataCells
                                    items={item.items}
                                    name={item.name}
                                    searchChunks={searchChunks}
                                />
                            ) : (
                                <AuthorityCell
                                    empty={item.empty}
                                    id={item.id}
                                    implicit={item.implicit}
                                    label
                                    name={item.name}
                                    searchChunks={searchChunks}
                                />
                            )}
                        </DataTableRow>
                    ))}
                </AuthorityTableBodyMask>
            </DataTableBody>
        </DataTable>
    </div>
)

AuthorityTable.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    name: PropTypes.string.isRequired,
    error: PropTypes.any,
    headers: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    metadata: PropTypes.bool,
    searchChunks: PropTypes.arrayOf(PropTypes.string),
}

export { AuthorityTable }
