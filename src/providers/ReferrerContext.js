import React from 'react'

export const ReferrerContext = React.createContext({
    referrer: '',
    setReferrer: () => {},
})
