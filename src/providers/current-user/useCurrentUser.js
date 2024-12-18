import { useContext } from 'react'
import { CurrentUserContext } from './CurrentUserProvider.js'

export const useCurrentUser = () => useContext(CurrentUserContext)
