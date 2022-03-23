import { ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import BulkUserManager from './BulkUserManager/index.js'

const BulkUserManagerFF = ({ input, groupId }) => {
    const handleChange = useCallback(
        pendingChanges => {
            input.onChange(pendingChanges)
            input.onBlur()
        },
        [input.onChange, input.onBlur]
    )

    return <BulkUserManager groupId={groupId} onChange={handleChange} />
}

BulkUserManagerFF.propTypes = {
    input: PropTypes.shape({
        onBlur: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    groupId: PropTypes.string,
}

const BulkUserManagerField = props => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState([])

    return (
        <ReactFinalForm.Field
            {...props}
            component={BulkUserManagerFF}
            initialValue={memoedInitialValue}
        />
    )
}

export default BulkUserManagerField
