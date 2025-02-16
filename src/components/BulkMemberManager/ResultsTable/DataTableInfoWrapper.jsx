import {
    DataTable,
    DataTableBody,
    DataTableRow,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DataTableInfoWrapper.module.css'

const DataTableInfoWrapper = ({ children }) => (
    <DataTable>
        <DataTableBody>
            <DataTableRow>
                <DataTableCell colSpan="4">
                    <div className={styles.wrapper}>{children}</div>
                </DataTableCell>
            </DataTableRow>
        </DataTableBody>
    </DataTable>
)

DataTableInfoWrapper.propTypes = {
    children: PropTypes.node.isRequired,
}

export default DataTableInfoWrapper
