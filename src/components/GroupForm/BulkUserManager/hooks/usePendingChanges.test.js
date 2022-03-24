import { renderHook, act } from '@testing-library/react-hooks'
import { usePendingChanges } from './usePendingChanges'

describe('usePendingChanges', () => {
    it('should support adding and getting changes', () => {
        const { result } = renderHook(() => usePendingChanges())

        expect(result.current.size).toBe(0)

        act(() => {
            result.current.add({
                id: 'user-1',
                username: 'username1',
            })
        })

        expect(result.current.size).toBe(1)
        expect(result.current.map(change => change)).toEqual([
            {
                action: 'ADD',
                userId: 'user-1',
                username: 'username1',
            },
        ])

        act(() => {
            result.current.remove({
                id: 'user-2',
                username: 'username2',
            })
        })

        expect(result.current.size).toBe(2)
        expect(result.current.get('user-1')).toEqual({
            action: 'ADD',
            userId: 'user-1',
            username: 'username1',
        })
        expect(result.current.map(change => change)).toEqual([
            {
                action: 'ADD',
                userId: 'user-1',
                username: 'username1',
            },
            {
                action: 'REMOVE',
                userId: 'user-2',
                username: 'username2',
            },
        ])
    })

    it('should support cancelling changes', () => {
        const { result } = renderHook(() => usePendingChanges())

        act(() => {
            result.current.add({
                id: 'user-1',
                username: 'username1',
            })
        })

        act(() => {
            result.current.map(change => {
                result.current.cancel(change)
            })
        })

        expect(result.current.size).toBe(0)

        act(() => {
            result.current.add({
                id: 'user-1',
                username: 'username1',
            })
        })

        act(() => {
            result.current.cancelAll()
        })

        expect(result.current.size).toBe(0)
    })

    it('should only change reference when mutating', () => {
        const { result, rerender } = renderHook(() => usePendingChanges())
        const reference1 = result.current

        act(() => {
            result.current.get('user-1')
        })

        rerender()
        expect(result.current).toBe(reference1)

        act(() => {
            result.current.add({
                id: 'user-1',
                username: 'username1',
            })
        })

        expect(result.current).not.toBe(reference1)
    })
})
