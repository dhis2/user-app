import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import { addValueRenderer } from 'd2-ui/lib/data-table/data-value/valueRenderers';

const BooleanCellField = ({ value }) =>
    value ? (
        <div style={{ width: '40px' }}>
            <CheckIcon />
        </div>
    ) : null;

BooleanCellField.propTypes = { value: PropTypes.bool };

addValueRenderer(({ value }) => typeof value === 'boolean', BooleanCellField);
