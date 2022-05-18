import reducer from './currentItem.js'

describe('currentItem reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {})

        expect(actualState).toEqual(null)
    })
})
