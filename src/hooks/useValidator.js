import memoizeOne from 'memoize-one'
import { useCallback } from 'react'

// Only compare first arg of validators, which is current value
const isEqual = (newArgs, lastArgs) => Object.is(newArgs[0], lastArgs[0])

// Memoize validator as react final form reruns all validators when any field
// changes.
// See https://github.com/final-form/react-final-form/issues/292
export const useValidator = (validator) => {
    const memoedValidator = memoizeOne(validator, isEqual)
    return useCallback(memoedValidator, [])
}
