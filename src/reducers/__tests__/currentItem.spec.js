import reducer from '../currentItem'

describe('currentItem reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {})

        expect(actualState).toEqual(null)
    })
})
