import { renderHook, act } from '@testing-library/react-hooks'
import { useMap } from './useMap'

describe('useMap', () => {
    it('should support setting and getting values', () => {
        const { result } = renderHook(() => useMap())

        expect(result.current.size).toBe(0)

        act(() => {
            result.current.set('key', 'value')
        })

        expect(result.current.size).toBe(1)
        expect(result.current.get('key')).toBe('value')

        act(() => {
            result.current.set('key', 'value2')
        })

        expect(result.current.get('key')).toBe('value2')
    })

    it('should support deleting keys', () => {
        const { result } = renderHook(() => useMap())

        act(() => {
            result.current.set('key', 'value')
            result.current.delete('key')
        })

        expect(result.current.size).toBe(0)
    })

    it('should support clearing', () => {
        const { result } = renderHook(() => useMap())

        act(() => {
            result.current.set('key1', 'value1')
            result.current.set('key2', 'value2')
        })

        expect(result.current.size).toBe(2)

        act(() => {
            result.current.clear()
        })

        expect(result.current.size).toBe(0)
    })

    it('should support getting all values as iterator', () => {
        const { result } = renderHook(() => useMap())

        act(() => {
            result.current.set('key1', 'value1')
            result.current.set('key2', 'value2')
        })

        const values = Array.from(result.current.values())
        expect(values).toEqual(['value1', 'value2'])
    })

    it('should only change reference when mutating the map', () => {
        const { result, rerender } = renderHook(() => useMap())
        const reference1 = result.current

        act(() => {
            result.current.get('key')
        })

        rerender()
        expect(result.current).toBe(reference1)

        act(() => {
            result.current.set('key', 'value')
        })

        expect(result.current).not.toBe(reference1)
    })
})
