import {
    DataTable,
    DataTableBody,
    DataTableRow,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DataTableInfoWrapper.module.css'

const DataTableInfoWrapper = ({ children, columns }) => (
    <DataTable>
        <DataTableBody>
            <DataTableRow>
                <DataTableCell staticStyle colSpan={String(columns)}>
                    <div className={styles.wrapper}>{children}</div>
                </DataTableCell>
            </DataTableRow>
        </DataTableBody>
    </DataTable>
)

DataTableInfoWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    columns: PropTypes.number.isRequired,
}

export default DataTableInfoWrapper
