import { keyBy } from 'lodash-es'
import { getMetadataAuthBaseName, createMetadataGroup } from './metadata.js'

describe('getMetadataAuthBaseName', () => {
    it(`returns the authority's base name by removing its ID's suffix`, () => {
        ;[
            ['F_CATEGORY_COMBO_DELETE', 'F_CATEGORY_COMBO'],
            ['F_DOCUMENT_PUBLIC_ADD', 'F_DOCUMENT'],
            ['FOO', 'FOO'],
            ['X_EXTERNAL_FOO_EXTERNAL', 'X_EXTERNAL_FOO'],
        ].forEach(([authID, expectedBaseName]) => {
            expect(getMetadataAuthBaseName(authID)).toBe(expectedBaseName)
        })
    })
})

describe('createMetadataGroup', () => {
    it('returns null if the authority is not actually a metadata authority', () => {
        expect(
            createMetadataGroup('F_ENROLLMENT_CASCADE_DELETE', new Map())
        ).toBe(null)
    })

    it('creates a metadata group from related metadata authorities', () => {
        const authIDs = [
            'F_ATTRIBUTE_PUBLIC_ADD',
            'F_ATTRIBUTE_PRIVATE_ADD',
            'F_ATTRIBUTE_DELETE',
            'F_ATTRIBUTE_EXTERNAL',
        ]
        const auths = keyBy(
            authIDs.map((id) => ({ id })),
            'id'
        )
        const createLookup = () => new Map(Object.entries(auths))

        const expectedGroup = {
            name: 'Attribute',
            addUpdatePublic: {
                id: 'F_ATTRIBUTE_PUBLIC_ADD',
            },
            addUpdatePrivate: {
                id: 'F_ATTRIBUTE_PRIVATE_ADD',
            },
            delete: {
                id: 'F_ATTRIBUTE_DELETE',
            },
            externalAccess: {
                id: 'F_ATTRIBUTE_EXTERNAL',
            },
        }

        for (const authID of authIDs) {
            // IDs in group will be deleted from lookup so need to create a new
            // lookup every test
            const lookup = createLookup()
            // Any auth ID that is a member of the group should work
            const group = createMetadataGroup(authID, lookup)
            expect(group).toEqual(expectedGroup)
        }
    })

    it('supports authorities which do not distinguish between PUBLIC_ADD and PRIVATE_ADD', () => {
        const authIDs = [
            'F_ATTRIBUTE_ADD',
            'F_ATTRIBUTE_DELETE',
            'F_ATTRIBUTE_EXTERNAL',
        ]
        const auths = keyBy(
            authIDs.map((id) => ({ id })),
            'id'
        )
        const lookup = new Map(Object.entries(auths))

        const expectedGroup = {
            name: 'Attribute',
            addUpdatePublic: {
                id: 'F_ATTRIBUTE_ADD',
            },
            addUpdatePrivate: {
                empty: true,
            },
            delete: {
                id: 'F_ATTRIBUTE_DELETE',
            },
            externalAccess: {
                id: 'F_ATTRIBUTE_EXTERNAL',
            },
        }

        const group = createMetadataGroup('F_ATTRIBUTE_ADD', lookup)
        expect(group).toEqual(expectedGroup)
    })

    // TODO: implicit selections from `AUTHS_WITH_IMPLICIT_ADD_PRIVATE_AND_DELETE`
    it('supports metadata authorities with no PUBLIC_ADD and DELETE siblings', () => {
        const auths = {
            F_DASHBOARD_PUBLIC_ADD: {
                id: 'F_DASHBOARD_PUBLIC_ADD',
            },
        }
        const lookup = new Map(Object.entries(auths))

        const expectedGroup = {
            name: 'Dashboard',
            addUpdatePublic: {
                id: 'F_DASHBOARD_PUBLIC_ADD',
            },
            addUpdatePrivate: {
                implicit: true,
            },
            delete: {
                implicit: true,
            },
            externalAccess: {
                empty: true,
            },
        }

        expect(createMetadataGroup('F_DASHBOARD_PUBLIC_ADD', lookup)).toEqual(
            expectedGroup
        )
    })

    it('deletes all related authorities from the lookup', () => {
        const metadataAuthIDs = [
            'F_ATTRIBUTE_PUBLIC_ADD',
            'F_ATTRIBUTE_PRIVATE_ADD',
            'F_ATTRIBUTE_DELETE',
            'F_ATTRIBUTE_EXTERNAL',
        ]
        const otherAuthIDs = [
            'SOME_OTHER_AUTH_1',
            'SOME_OTHER_AUTH_2',
            'SOME_OTHER_AUTH_3',
        ]
        const authIDs = [...metadataAuthIDs, ...otherAuthIDs]
        const auths = keyBy(
            authIDs.map((id) => ({ id })),
            'id'
        )
        const lookup = new Map(Object.entries(auths))

        createMetadataGroup('F_ATTRIBUTE_PUBLIC_ADD', lookup)

        for (const authID of metadataAuthIDs) {
            expect(lookup.has(authID)).toBe(false)
        }
        for (const authID of otherAuthIDs) {
            expect(lookup.has(authID)).toBe(true)
        }
    })
})
