import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { ReferrerContext } from './ReferrerContext.js'

export const ReferrerProvider = ({ children }) => {
    const [referrer, setReferrer] = useState('')
    const providerValue = { referrer, setReferrer }
    return (
        <ReferrerContext.Provider value={providerValue}>
            {children}
        </ReferrerContext.Provider>
    )
}

ReferrerProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
