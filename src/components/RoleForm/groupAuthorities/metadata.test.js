import { getMetadataAuthBaseName, createMetadataGroup } from './metadata.js'

describe('getMetadataAuthBaseName', () => {
    it(`returns the authority's base name by removing its ID's suffix`, () => {
        [
            ['F_CATEGORY_COMBO_DELETE', 'F_CATEGORY_COMBO'],
            ['F_DOCUMENT_PUBLIC_ADD', 'F_DOCUMENT'],
            ['FOO', 'FOO'],
            ['X_EXTERNAL_FOO_EXTERNAL', 'X_EXTERNAL_FOO'],
        ].forEach(([ authID, expectedBaseName ]) => {
            expect(getMetadataAuthBaseName(authID)).toBe(expectedBaseName)
        })
    })
})

describe('createMetadataGroup', () => {
    // TODO
})
