import groupAuthorities from './groupAuthorities.js'

describe('groupAuthorities', () => {
    it('groups unknown authorities under the system group', () => {
        const authorities = [{ id: 'FOO' }]
        const groupedAuthorities = groupAuthorities(authorities)

        expect(groupedAuthorities.metadata).toHaveLength(0)
        expect(groupedAuthorities.apps).toHaveLength(0)
        expect(groupedAuthorities.tracker).toHaveLength(0)
        expect(groupedAuthorities.importExport).toHaveLength(0)
        expect(groupedAuthorities.system).toHaveLength(1)

        expect(groupedAuthorities.system[0].id).toBe('FOO')
    })

    it('ensures authorities are only added once to any group', () => {
        const authorities = [{ id: 'FOO' }, { id: 'BAR' }, { id: 'FOO' }]
        const groupedAuthorities = groupAuthorities(authorities)

        expect(groupedAuthorities.metadata).toHaveLength(0)
        expect(groupedAuthorities.apps).toHaveLength(0)
        expect(groupedAuthorities.tracker).toHaveLength(0)
        expect(groupedAuthorities.importExport).toHaveLength(0)
        expect(groupedAuthorities.system).toHaveLength(2)

        expect(groupedAuthorities.system[0].id).toBe('FOO')
        expect(groupedAuthorities.system[1].id).toBe('BAR')
    })

    it(`sets the name of the ALL authority to 'All (Full authority)'`, () => {
        const authorities = [{ id: 'ALL' }]
        const groupedAuthorities = groupAuthorities(authorities)

        expect(groupedAuthorities.system).toHaveLength(1)
        expect(groupedAuthorities.system[0].id).toBe('ALL')
        expect(groupedAuthorities.system[0].name).toBe('All (Full authority)')
    })

    it('groups authorities with the app authority prefix M_ under the apps group', () => {
        const authorities = [{ id: 'M_SOME_APP' }]
        const groupedAuthorities = groupAuthorities(authorities)

        expect(groupedAuthorities.apps).toHaveLength(1)
        expect(groupedAuthorities.apps[0].id).toBe('M_SOME_APP')
    })

    it('sorts authorities alphabetically according to their name', () => {
        const authorities = [
            { id: 'FOO', name: 'Foo' },
            { id: 'BAR', name: 'Bar' },
            { id: 'FOOBAR', name: 'Foobar' },
        ]
        const groupedAuthorities = groupAuthorities(authorities)

        expect(groupedAuthorities.system).toHaveLength(3)
        expect(groupedAuthorities.system[0].id).toBe('BAR')
        expect(groupedAuthorities.system[1].id).toBe('FOO')
        expect(groupedAuthorities.system[2].id).toBe('FOOBAR')
    })
})
