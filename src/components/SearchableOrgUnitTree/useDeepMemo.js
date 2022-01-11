import { isEqual } from 'lodash-es'
import { useRef } from 'react'

// Like useMemo but with deepEquality
export const useDeepMemo = (fn, keys) => {
    const ref = useRef()

    if (!ref.current || !isEqual(keys, ref.current.keys)) {
        ref.current = { keys, value: fn() }
    }

    return ref.current.value
}
