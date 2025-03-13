import { useContext } from 'react'
import { CurrentUserContext } from './CurrentUserProvider.jsx'

export const useCurrentUser = () => useContext(CurrentUserContext)
