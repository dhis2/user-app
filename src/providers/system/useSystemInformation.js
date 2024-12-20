import { useContext } from 'react'
import { SystemContext } from './SystemContext.js'

export const useSystemInformation = () => useContext(SystemContext)
