import { Input, spacers, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const FilterInput = ({ value, onChange, placeholder, className, dataTest }) => (
    <div className={className}>
        <Input
            dense
            dataTest={dataTest}
            value={value}
            onChange={onChange}
            type="text"
            name="filter"
            placeholder={placeholder}
            initialFocus
        />

        <style jsx>{`
            div {
                position: sticky;
                top: 0;
                background: ${colors.white};
                padding: ${spacers.dp8} ${spacers.dp8} ${spacers.dp4}
                    ${spacers.dp8};
                z-index: 1;
            }
        `}</style>
    </div>
)

FilterInput.propTypes = {
    dataTest: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
}

export { FilterInput }
