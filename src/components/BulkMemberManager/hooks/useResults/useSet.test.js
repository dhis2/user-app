import { renderHook, act } from '@testing-library/react-hooks'
import { useSet } from './useSet.js'

describe('useSet', () => {
    it('should support adding values and checking for their presence', () => {
        const { result } = renderHook(() => useSet())

        expect(result.current.size).toBe(0)

        act(() => {
            result.current.add('value')
        })

        expect(result.current.size).toBe(1)
        expect(result.current.has('value')).toBe(true)

        act(() => {
            result.current.add('value2')
        })

        expect(result.current.size).toBe(2)
        expect(result.current.has('value2')).toBe(true)
        expect(result.current.has('value3')).toBe(false)
    })

    it('should support deleting values', () => {
        const { result } = renderHook(() => useSet())

        act(() => {
            result.current.add('value')
            result.current.delete('value')
        })

        expect(result.current.size).toBe(0)
    })

    it('should support clearing', () => {
        const { result } = renderHook(() => useSet())

        act(() => {
            result.current.add('value1')
            result.current.add('value2')
        })

        expect(result.current.size).toBe(2)

        act(() => {
            result.current.clear()
        })

        expect(result.current.size).toBe(0)
    })

    it('should only change reference when mutating the set', () => {
        const { result, rerender } = renderHook(() => useSet())
        const reference1 = result.current

        act(() => {
            result.current.has('value')
        })

        rerender()
        expect(result.current).toBe(reference1)

        act(() => {
            result.current.add('value')
        })

        expect(result.current).not.toBe(reference1)
    })
})
