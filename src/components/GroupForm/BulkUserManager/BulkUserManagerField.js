import { ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import BulkUserManager from './BulkUserManager.js'

const BulkUserManagerFF = ({ className, input, groupId }) => {
    const handleChange = useCallback(
        (value) => {
            input.onChange(value)
            input.onBlur()
        },
        [input.onChange, input.onBlur]
    )

    return (
        <BulkUserManager
            className={className}
            groupId={groupId}
            value={input.value}
            onChange={handleChange}
        />
    )
}

BulkUserManagerFF.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.object.isRequired,
        onBlur: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    className: PropTypes.string,
    groupId: PropTypes.string,
}

const BulkUserManagerField = (props) => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState({
        additions: [],
        removals: [],
    })

    return (
        <ReactFinalForm.Field
            {...props}
            component={BulkUserManagerFF}
            initialValue={memoedInitialValue}
        />
    )
}

export default BulkUserManagerField
