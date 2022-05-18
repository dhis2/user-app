import {
    groupAuthorities,
    getInitiallySelectedColumns,
} from './MetadataAuthoritiesTableField.js'

describe('groupAuthorities', () => {
    it('groups metadata authorities', () => {
        const groupedAuthorities = groupAuthorities([
            {
                addUpdatePublic: { id: 'ADD_UPDATE_PUBLIC' },
                addUpdatePrivate: { id: 'ADD_UPDATE_PRIVATE' },
                delete: {},
                externalAccess: {},
            },
            {
                addUpdatePublic: { id: 'ADD_UPDATE_PUBLIC_2' },
                addUpdatePrivate: {},
                delete: {},
                externalAccess: {},
            },
        ])

        expect(groupedAuthorities.addUpdatePublic).toHaveLength(2)
        expect(groupedAuthorities.addUpdatePrivate).toHaveLength(1)
        expect(groupedAuthorities.delete).toHaveLength(0)
        expect(groupedAuthorities.externalAccess).toHaveLength(0)

        expect(groupedAuthorities.addUpdatePublic).toEqual([
            'ADD_UPDATE_PUBLIC',
            'ADD_UPDATE_PUBLIC_2',
        ])
        expect(groupedAuthorities.addUpdatePrivate).toEqual([
            'ADD_UPDATE_PRIVATE',
        ])
    })
})

describe('getInitiallySelectedColumns', () => {
    it('returns a set', () => {
        const columns = getInitiallySelectedColumns({
            metadataAuthorities: [],
            selectedAuthorities: new Set(),
        })
        expect(columns).toBeInstanceOf(Set)
        expect(columns.size).toBe(0)
    })

    it('returns initially selected columns', () => {
        const columns = getInitiallySelectedColumns({
            metadataAuthorities: [
                {
                    name: 'Some group',
                    addUpdatePublic: { id: 'FOO' },
                    addUpdatePrivate: {},
                    delete: {},
                    externalAccess: { id: 'BAR' },
                },
                {
                    name: 'Another group',
                    addUpdatePublic: { id: 'FOOBAR' },
                    addUpdatePrivate: {},
                    delete: {},
                    externalAccess: { id: 'BAZ' },
                },
            ],
            selectedAuthorities: new Set(['FOO', 'BAR', 'FOOBAR']),
        })
        expect(columns.size).toBe(1)
        expect(columns.has('addUpdatePublic')).toBe(true)
        expect(columns.has('externalAccess')).toBe(false)
    })
})
