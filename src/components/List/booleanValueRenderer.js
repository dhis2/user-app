/**
 * If you import this module into a component that renders a DataTable,
 * it will render MaterialUI checkboxes for TRUE values and keep FALSE values empty.
 * @module List/booleanValueRenderer
 */

import { addValueRenderer } from '@dhis2/d2-ui-table/data-value/valueRenderers'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * Defines behavior for the DataTable when receiving boolean values
 * @param {Object} DataTableCell - A DataTableCell containing a value property
 * @param {Boolean} DataTableCell.value - The cell value
 * @returns Either a CheckIcon or null
 */
const BooleanCellField = ({ value }) =>
    value ? (
        <div style={{ width: '40px' }}>
            <CheckIcon />
        </div>
    ) : null

BooleanCellField.propTypes = { value: PropTypes.bool }

addValueRenderer(({ value }) => typeof value === 'boolean', BooleanCellField)
