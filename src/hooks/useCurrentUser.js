import { useContext } from 'react'
import { CurrentUserContext } from '../components/CurrentUserProvider.js'

export const useCurrentUser = () => useContext(CurrentUserContext)
