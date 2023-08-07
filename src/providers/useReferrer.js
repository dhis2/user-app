import { useContext } from 'react'
import { ReferrerContext } from './ReferrerContext.js'

export const useReferrerInfo = () => useContext(ReferrerContext)
