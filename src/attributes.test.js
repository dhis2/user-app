import { getAttributeValues } from './attributes.js'

describe('getAttributeValues', () => {
    it('generates attribute values from attributes and form values', () => {
        const attributes = [
            { id: 'ATTR_1', valueType: 'TEXT' },
            { id: 'ATTR_2', valueType: 'EMAIL' },
            { id: 'ATTR_3', valueType: 'XXX' },
        ]
        const values = {
            attributeValues: {
                ATTR_1: 'VALUE_1',
                ATTR_2: 'VALUE_2',
                ATTR_3: 'VALUE_3',
            },
        }

        const attributeValues = getAttributeValues({ attributes, values })
        expect(attributeValues).toEqual([
            {
                attribute: {
                    id: 'ATTR_1',
                },
                value: 'VALUE_1',
            },
            {
                attribute: {
                    id: 'ATTR_2',
                },
                value: 'VALUE_2',
            },
            {
                attribute: {
                    id: 'ATTR_3',
                },
                value: 'VALUE_3',
            },
        ])
    })

    it(`handles the 'false value for a TRUE_ONLY attribute' edge case`, () => {
        const attributes = [
            { id: 'ATTR_1', valueType: 'TRUE_ONLY' },
            { id: 'ATTR_2', valueType: 'TRUE_ONLY' },
        ]
        const values = {
            attributeValues: {
                ATTR_1: 'true',
                ATTR_2: false,
            },
        }

        const attributeValues = getAttributeValues({ attributes, values })
        expect(attributeValues).toEqual([
            {
                attribute: {
                    id: 'ATTR_1',
                },
                value: 'true',
            },
            {
                attribute: {
                    id: 'ATTR_2',
                },
                value: '',
            },
        ])
    })
})
